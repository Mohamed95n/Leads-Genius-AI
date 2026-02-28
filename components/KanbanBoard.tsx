'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { Lead, LeadStage } from '@/types';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, Phone, Mail, MapPin, MoreVertical, Star } from 'lucide-react';

const STAGES: LeadStage[] = ['New Leads', 'Contacted', 'Follow-up', 'Closed Won', 'Closed Lost'];

function SortableLeadCard({ lead, onClick }: { lead: Lead; onClick: (lead: Lead) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id, data: { type: 'Lead', lead } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-indigo-50 border-2 border-indigo-400 border-dashed rounded-lg h-32 opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(lead)}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-900 text-sm truncate pr-6">{lead.name}</h4>
        <div className="absolute top-3 right-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4" />
        </div>
      </div>
      
      <div className="space-y-1.5 mb-3">
        {lead.location && (
          <div className="flex items-center text-xs text-slate-500 gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{lead.location}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center text-xs text-slate-500 gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span className="truncate">{lead.phone}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs font-medium">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-slate-700">{lead.rating > 0 ? lead.rating : 'N/A'}</span>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          lead.score >= 80 ? 'bg-green-100 text-green-800' :
          lead.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          Score: {lead.score}
        </span>
      </div>
    </div>
  );
}

import { useDroppable } from '@dnd-kit/core';

function DroppableColumn({ stage, leads, onLeadClick }: { stage: LeadStage; leads: Lead[]; onLeadClick: (lead: Lead) => void }) {
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <div 
      ref={setNodeRef}
      className="flex flex-col bg-slate-100/50 rounded-xl p-4 min-w-[300px] w-[300px] border border-slate-200/60 h-full"
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">{stage}</h3>
        <span className="bg-white text-slate-500 text-xs font-medium px-2 py-1 rounded-full shadow-sm border border-slate-200">
          {leads.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-[150px]">
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 pb-4 min-h-[100px]">
            {leads.map(lead => (
              <SortableLeadCard key={lead.id} lead={lead} onClick={onLeadClick} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanBoard({ onLeadClick }: { onLeadClick: (lead: Lead) => void }) {
  const { leads, updateLeadStage } = useLeads();
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find(l => l.id === active.id);
    if (lead) setActiveLead(lead);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeLead = leads.find(l => l.id === activeId);
    const overLead = leads.find(l => l.id === overId);
    
    // If dropped over a column (we need to make columns droppable, but for simplicity, 
    // we can just check if overId is a stage name, or if it's another lead, we get its stage)
    
    if (activeLead) {
      let newStage = activeLead.stage;
      
      if (STAGES.includes(overId as LeadStage)) {
        newStage = overId as LeadStage;
      } else if (overLead) {
        newStage = overLead.stage;
      }

      if (activeLead.stage !== newStage) {
        updateLeadStage(activeLead.id, newStage);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Sales Pipeline</h2>
        <p className="text-slate-500">Drag and drop leads to update their status.</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full items-start">
            {STAGES.map(stage => (
              <DroppableColumn
                key={stage}
                stage={stage}
                leads={leads.filter(l => l.stage === stage)}
                onLeadClick={onLeadClick}
              />
            ))}
          </div>

          <DragOverlay>
            {activeLead ? (
              <div className="bg-white p-4 rounded-lg shadow-xl border border-indigo-200 opacity-90 w-[268px] rotate-2">
                <h4 className="font-semibold text-slate-900 text-sm truncate">{activeLead.name}</h4>
                <div className="mt-2 text-xs text-slate-500">{activeLead.location}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
