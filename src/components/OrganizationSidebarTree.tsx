import { useState } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import type { OrgNode } from '../data/organization';

type Props = { nodes: OrgNode[]; selectedId?: string; onSelect: (id: string) => void };
export default function OrganizationSidebarTree({ nodes, selectedId, onSelect }: Props) {
  return <div className="mr-4 space-y-1 border-r border-white/10 pr-2" role="group" aria-label="الجهات والوحدات التابعة">
    {nodes.map(node => <Branch key={node.id} node={node} selectedId={selectedId} onSelect={onSelect}/>)}
  </div>;
}
function Branch({ node, selectedId, onSelect }: { node: OrgNode; selectedId?: string; onSelect: (id: string) => void; key?: string }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!node.children?.length;
  return <div>
    <div className={`flex items-center rounded-xl ${selectedId === node.id ? 'bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]' : 'text-slate-400 hover:bg-white/5'}`}>
      <button onClick={() => { onSelect(node.id); if (hasChildren) setExpanded(true); }} className="min-w-0 flex-1 px-3 py-2.5 text-right text-sm font-bold">
        <span className="block">{node.name}</span>
        {node.status && <span className="mt-1 block text-[10px] font-medium text-amber-300">{node.status}</span>}
        {node.description && <span className="mt-1 block text-[10px] font-normal leading-5 text-slate-500">{node.description}</span>}
      </button>
      {node.website && <a href={node.website} target="_blank" rel="noreferrer" className="rounded-lg px-2 py-1 text-[10px] font-bold text-[var(--theme-accent)] hover:bg-white/10" aria-label={`زيارة موقع ${node.name}`}>الموقع</a>}
      {hasChildren && <button aria-label={`${expanded ? 'طي' : 'توسيع'} ${node.name}`} aria-expanded={expanded} onClick={()=>setExpanded(value=>!value)} className="rounded-lg p-2 hover:bg-white/10">{expanded ? <ChevronDown className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}</button>}
    </div>
    {hasChildren && expanded && <OrganizationSidebarTree nodes={node.children!} selectedId={selectedId} onSelect={onSelect}/>}
  </div>;
}
