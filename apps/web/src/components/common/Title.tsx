// apps/web/src/components/common/Title.tsx

interface TitleProps {
  title: any;
  className?: string;
  as?: React.ElementType;
}

export function Title({ title, className = '', as: Tag = 'div' }: TitleProps) {
  return <Tag className={className}>{title}</Tag>;
}
