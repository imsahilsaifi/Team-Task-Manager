export default function StatusBadge({ status }) {
  const config = {
    TODO: { label: 'To Do', className: 'status-todo' },
    IN_PROGRESS: { label: 'In Progress', className: 'status-in-progress' },
    DONE: { label: 'Done', className: 'status-done' },
  };

  const { label, className } = config[status] || config.TODO;

  return <span className={`badge ${className}`}>{label}</span>;
}
