'use client';

import { cn } from '@/lib/utils';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import React from 'react';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

const CollapsibleContent = React.forwardRef(function CollapsibleContent(
  { className, ...props },
  ref
) {
  return (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up',
        className
      )}
      {...props}
    />
  );
});

export { Collapsible, CollapsibleContent, CollapsibleTrigger };