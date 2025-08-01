import { useState, useEffect } from 'react';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { MapPin, Trash2 } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';

interface StoryPoint {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface StoryPointsProps {
  value: StoryPoint[];
  onChange: (points: StoryPoint[]) => void;
  onPointSelect?: (point: StoryPoint) => void;
  onRemove?: (pointId: string) => void;
}

function SortableStoryPoint({
  point,
  index,
  onRemove
}: {
  point: StoryPoint;
  index: number;
  onRemove?: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: point.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md border bg-card p-3"
    >
      <div {...attributes} {...listeners}>
        <DragHandleDots2Icon className="h-5 w-5 cursor-grab" />
      </div>
      <div className="flex flex-1 items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span className="flex-1">{point.name}</span>
        <span className="text-xs text-muted-foreground">
          {`Stop ${index + 1}`}
        </span>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(point.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function StoryPoints({
  value = [],
  onChange,
  onPointSelect,
  onRemove
}: StoryPointsProps) {
  const [points, setPoints] = useState<StoryPoint[]>(value);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    setPoints(value || []);
  }, [value]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPoints((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newPoints = arrayMove(items, oldIndex, newIndex);

        onChange(newPoints);

        return newPoints;
      });
    }
  };

  if (!Array.isArray(points)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={points} strategy={verticalListSortingStrategy}>
          {points.map((point, index) => (
            <div
              key={point.id}
              onClick={() => onPointSelect?.(point)}
              className="cursor-pointer"
            >
              <SortableStoryPoint
                point={point}
                index={index}
                onRemove={onRemove}
              />
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
