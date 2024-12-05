"use client";

import React, { useEffect, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, type Node, MarkerType, Position, Handle, Connection } from '@xyflow/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import '@xyflow/react/dist/style.css';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const NodeContent = ({ data } : {
    data: {
        title: string;
        description: string;
        status: string;
    }
}) => (
  <div className="flex flex-col gap-3 min-w-[200px] max-w-[280px] bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-[0_0_32px_-4px_rgba(0,0,0,0.3)] border border-white/10 hover:shadow-[0_0_32px_-2px_rgba(0,0,0,0.4)] hover:bg-black/50 transition-all duration-300">
    <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-blue-500/80 !border !border-white/40" />
    <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-blue-500/80 !border !border-white/40" />
    
    {data.title || data.description || data.status ? (
      <>
        <div className="flex flex-col gap-2">
          <div className="font-medium text-base text-white/90">
            {data.title || 'No Title'}
          </div>
          <div className="text-sm text-white/70 line-clamp-3">
            {data.description || 'No Description'}
          </div>
          <Badge className={`
            w-fit text-[11px] px-2.5 py-0.5 mt-1 font-medium
            ${data.status === 'todo' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30' : ''}
            ${data.status === 'in-progress' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' : ''}
            ${data.status === 'done' ? 'bg-green-500/20 text-green-200 border border-green-500/30' : ''}
            ${!data.status ? 'bg-gray-500/20 text-gray-200 border border-gray-500/30' : ''}
          `}>
            {data.status || 'No Status'}
          </Badge>
        </div>
      </>
    ) : (
      <div className="flex items-center justify-center h-24 text-white/50 text-sm">
        <div className="flex flex-col items-center gap-2">
          <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Click to add details
        </div>
      </div>
    )}
  </div>
);

const initialNodes = [
  { 
    id: '1', 
    type: 'default',
    data: { 
      label: 'Task 1',
      title: '',
      description: '',
      status: ''
    }, 
    position: { x: 250, y: 100 },
  },
  { 
    id: '2', 
    type: 'default',
    data: { 
      label: 'Task 2',
      title: '',
      description: '',
      status: ''
    }, 
    position: { x: 250, y: 300 },
  },
];

const initialEdges = [{ 
  id: 'e1-2', 
  source: '1', 
  target: '2',
  style: { 
    stroke: '#fff',
    strokeWidth: 2,
  },
  type: 'default',
  animated: true,
}];

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

interface FormData {
  title: string;
  description: string;
  status: string;
}

interface NodeData extends Record<string, unknown> {
  label?: string;
  title?: string;
  description?: string;
  status?: string;
}

const UpdateNode = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const handleNodeClick = (node: Node<NodeData>) => {
    setSelectedNode(node);
    setFormData({
      title: node.data.title || '',
      description: node.data.description || '',
      status: node.data.status || ''
    });
    setIsDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setNodes(nds =>
      nds.map(node => {
        if (node.id === selectedNode?.id) {
          return {
            ...node,
            data: {
              ...node.data,
              title: formData.title,
              description: formData.description,
              status: formData.status,
            },
          };
        }
        return node;
      })
    );
    
    setIsDialogOpen(false);
    setSelectedNode(null);
  };

  const [edgeIdCounter, setEdgeIdCounter] = useState(3);

  const onConnect = (params: Connection) => {
    setEdges((eds) => {
      return [...eds, {
        ...params,
        id: `e${edgeIdCounter}`, // Use the counter to generate a unique ID
        style: { 
          stroke: '#fff',
          strokeWidth: 2,
        },
        type: 'default',
        animated: true,
      }];
    });
    setEdgeIdCounter(edgeIdCounter + 1);
  };

  const handleAddNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'default',
      data: {
        label: `Task ${nodes.length + 1}`,
        title: '',
        description: '',
        status: ''
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleShowPreview = () => {
    setIsPreviewDialogOpen(true);
  };

  return (
    <div className="w-full h-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultViewport={defaultViewport}
        minZoom={0.2}
        maxZoom={4}
        defaultEdgeOptions={{
          style: { 
            stroke: '#fff',
            strokeWidth: 2,
          },
          type: 'default',
          animated: true,
        }}
        style={{ background: '#000', border: '1px solid #333', borderRadius: '10px' }}
        fitView={true}
        onNodeClick={(_, node) => handleNodeClick(node)}
        nodeTypes={{
          default: NodeContent
        }}
        onConnect={onConnect}
        connectOnClick={false}
        className="react-flow-node-default"
        nodesDraggable={true}
        proOptions={{
          hideAttribution: true
        }}
      >
        <Background />
        <style>
          {`
            .react-flow__node-default {
              padding: 0;
              border-radius: 0;
              border: none;
              background: transparent;
              width: auto;
              box-shadow: none;
            }
          `}
        </style>
      </ReactFlow>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border border-white/10 backdrop-blur-md shadow-[0_0_32px_-4px_rgba(0,0,0,0.3)]">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-white/90">
              {selectedNode ? `Edit ${selectedNode.data.label}` : 'Edit Node'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/70 text-sm">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Enter title"
                className="bg-black/50 border-white/10 text-white/90 placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/70 text-sm">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Enter description"
                className="bg-black/50 border-white/10 text-white/90 placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white/70 text-sm">Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white/90 focus:border-blue-500/50 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white/90">
                  <SelectItem value="todo" >To Do</SelectItem>
                  <SelectItem value="in-progress" >In Progress</SelectItem>
                  <SelectItem value="done" >Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-500/80 hover:bg-blue-500/90 text-white transition-colors mt-6"
            >
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="bg-black/90 border border-white/10 backdrop-blur-md shadow-[0_0_32px_-4px_rgba(0,0,0,0.3)] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-white/90">Nodes Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {nodes.map((node) => (
              <div 
                key={node.id} 
                className="p-4 rounded-lg bg-black/40 border border-white/10 hover:bg-black/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/90 font-medium">{node.data.label}</span>
                  <Badge className={`
                    text-[11px] px-2.5 py-0.5 font-medium
                    ${node.data.status === 'todo' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30' : ''}
                    ${node.data.status === 'in-progress' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' : ''}
                    ${node.data.status === 'done' ? 'bg-green-500/20 text-green-200 border border-green-500/30' : ''}
                    ${!node.data.status ? 'bg-gray-500/20 text-gray-200 border border-gray-500/30' : ''}
                  `}>
                    {node.data.status || 'No Status'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-white/50">Title: </span>
                    <span className="text-white/90">{node.data.title || 'No Title'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-white/50">Description: </span>
                    <span className="text-white/90">{node.data.description || 'No Description'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Separator className='my-3'/>
      <div className="flex justify-center items-center gap-4">
        <Button 
          className="w-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/90 transition-colors"
          onClick={handleAddNode}
        >
          Add Node
        </Button>
        <Button 
          className="w-full bg-blue-500/80 hover:bg-blue-500/90 text-white transition-colors"
          onClick={handleShowPreview}
        >
          Show Preview
        </Button>
      </div>
    </div>
  );
};

export default UpdateNode;