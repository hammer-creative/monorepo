import React from 'react';

interface TagProps {
  title: any;
  className?: string;
  as?: React.ElementType;
}

export function Tag({ title, className = '', as: Tag = 'span' }: TagProps) {
  return <Tag className={className}>{title}</Tag>;
}
