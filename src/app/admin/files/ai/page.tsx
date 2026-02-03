/**
 * AI Services Management Page
 * Manage AI-generated images, conversations, models, and suggestions
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Trash2, Plus, Edit, Zap, MessageSquare, Brain, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { fileService } from '@/lib/services';

interface AiImage {
  _id: string;
  userId: number;
  generationType: string;
  config: any;
  metadata: any[];
  createdAt: string;
}

interface AiConversation {
  _id: string;
  userId: number;
  title: string;
  purpose: string;
  createdAt: string;
}

interface AiModel {
  _id: string;
  purpose: string;
  model: string;
  title: string;
  description?: string;
  instructions: string;
  icon?: string;
  createdAt: string;
}

interface AiSuggestion {
  _id: string;
  text: string;
  modelId?: number;
  order: number;
  createdAt: string;
}

export default function AIManagementPage() {
  const [activeTab, setActiveTab] = useState('images');
  const [loading, setLoading] = useState(true);
  
  // AI Images
  const [aiImages, setAiImages] = useState<AiImage[]>([]);
  const [imagesPage, setImagesPage] = useState(1);
  const [imagesTotalPages, setImagesTotalPages] = useState(1);
  const [imageSearch, setImageSearch] = useState('');
  
  // AI Conversations
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [conversationsPage, setConversationsPage] = useState(1);
  const [conversationsTotalPages, setConversationsTotalPages] = useState(1);
  
  // AI Models
  const [models, setModels] = useState<AiModel[]>([]);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AiModel | null>(null);
  const [modelForm, setModelForm] = useState({
    purpose: '',
    model: 'gpt-4',
    title: '',
    description: '',
    instructions: '',
    icon: '',
  });
  
  // AI Suggestions
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState<AiSuggestion | null>(null);
  const [suggestionForm, setSuggestionForm] = useState({
    text: '',
    order: 0,
    modelId: undefined as number | undefined,
  });

  useEffect(() => {
    if (activeTab === 'images') loadAiImages();
    if (activeTab === 'conversations') loadConversations();
    if (activeTab === 'models') loadModels();
    if (activeTab === 'suggestions') {
      loadSuggestions();
      loadModels({ silent: true });
    }
  }, [activeTab, imagesPage, conversationsPage]);

  useEffect(() => {
    if (suggestionDialogOpen && models.length === 0) {
      loadModels({ silent: true });
    }
  }, [suggestionDialogOpen, models.length]);

  const loadAiImages = async () => {
    setLoading(true);
    try {
      const data = await fileService.getAiImages({
        page: imagesPage,
        limit: 20,
        ...(imageSearch && { prompt: imageSearch }),
      });
      setAiImages(data.data);
      setImagesTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load AI images');
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await fileService.getAiConversations({
        page: conversationsPage,
        limit: 20,
      });
      setConversations(data.data);
      setConversationsTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    try {
      const data = await fileService.getAiModels();
      setModels(data);
    } catch (error) {
      toast.error('Failed to load AI models');
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  };

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const data = await fileService.getAiSuggestions();
      setSuggestions(data);
    } catch (error) {
      toast.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const deleteAiImage = async (id: string) => {
    try {
      await fileService.deleteAiImage(id);
      toast.success('AI image deleted');
      loadAiImages();
    } catch (error) {
      toast.error('Failed to delete AI image');
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      await fileService.deleteAiConversation(id);
      toast.success('Conversation deleted');
      loadConversations();
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  const handleSaveModel = async () => {
    try {
      if (editingModel) {
        await fileService.updateAiModel(editingModel._id, modelForm);
      } else {
        await fileService.createAiModel(modelForm);
      }
      
      toast.success(`Model ${editingModel ? 'updated' : 'created'} successfully`);
      setModelDialogOpen(false);
      setEditingModel(null);
      setModelForm({ purpose: '', model: 'gpt-4', title: '', description: '', instructions: '', icon: '' });
      loadModels();
    } catch (error) {
      toast.error('Failed to save model');
    }
  };

  const handleSaveSuggestion = async () => {
    try {
      if (editingSuggestion) {
        await fileService.updateAiSuggestion(editingSuggestion._id, suggestionForm);
      } else {
        await fileService.createAiSuggestion(suggestionForm);
      }
      
      toast.success(`Suggestion ${editingSuggestion ? 'updated' : 'created'} successfully`);
      setSuggestionDialogOpen(false);
      setEditingSuggestion(null);
      setSuggestionForm({ text: '', order: 0, modelId: undefined });
      loadSuggestions();
    } catch (error) {
      toast.error('Failed to save suggestion');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Services Management</h2>
        <p className="text-muted-foreground">Manage AI-generated content, models, and configurations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="images">
            <Zap className="h-4 w-4 mr-2" />
            AI Images
          </TabsTrigger>
          <TabsTrigger value="conversations">
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="models">
            <Brain className="h-4 w-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <Sparkles className="h-4 w-4 mr-2" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        {/* AI Images Tab */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Images</CardTitle>
              <CardDescription>Manage AI-generated images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Search by prompt..."
                  value={imageSearch}
                  onChange={(e) => setImageSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadAiImages()}
                />
                <Button onClick={loadAiImages}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Images</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiImages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No AI images found
                        </TableCell>
                      </TableRow>
                    ) : (
                      aiImages.map((image) => (
                        <TableRow key={image._id}>
                          <TableCell>{image.userId}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{image.generationType}</Badge>
                          </TableCell>
                          <TableCell>{image.metadata?.length || 0} images</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDate(image.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteAiImage(image._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Conversations</CardTitle>
              <CardDescription>Manage user conversations with AI</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No conversations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      conversations.map((conv) => (
                        <TableRow key={conv._id}>
                          <TableCell className="font-medium">{conv.title}</TableCell>
                          <TableCell>{conv.userId}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{conv.purpose}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDate(conv.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteConversation(conv._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>AI Models</CardTitle>
                <CardDescription>Manage AI conversation models</CardDescription>
              </div>
              <Button onClick={() => {
                setEditingModel(null);
                setModelForm({ purpose: '', model: 'gpt-4', title: '', description: '', instructions: '', icon: '' });
                setModelDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Model
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {models.map((model) => (
                    <Card key={model._id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{model.title}</CardTitle>
                            <CardDescription>{model.description}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingModel(model);
                                setModelForm({
                                  purpose: model.purpose,
                                  model: model.model,
                                  title: model.title,
                                  description: model.description || '',
                                  instructions: model.instructions,
                                  icon: model.icon || '',
                                });
                                setModelDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Conversation Starters</CardTitle>
                <CardDescription>Manage conversation starter suggestions</CardDescription>
              </div>
              <Button onClick={() => {
                setEditingSuggestion(null);
                setSuggestionForm({ text: '', order: 0, modelId: undefined });
                setSuggestionDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Suggestion
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Text</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestions.map((suggestion) => (
                      <TableRow key={suggestion._id}>
                        <TableCell>{suggestion.text}</TableCell>
                        <TableCell>
                          {models.find((m) => m._id === String(suggestion.modelId))
                            ? models.find((m) => m._id === String(suggestion.modelId))?.title
                            : suggestion.modelId ?? '—'}
                        </TableCell>
                        <TableCell>{suggestion.order}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingSuggestion(suggestion);
                                setSuggestionForm({
                                  text: suggestion.text,
                                  order: suggestion.order,
                                  modelId: suggestion.modelId,
                                });
                                setSuggestionDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Model Dialog */}
      <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingModel ? 'Edit' : 'Create'} AI Model</DialogTitle>
            <DialogDescription>
              Configure AI conversation model settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="purpose">Purpose *</Label>
              <Input
                id="purpose"
                value={modelForm.purpose}
                onChange={(e) => setModelForm({ ...modelForm, purpose: e.target.value })}
                placeholder="e.g., general-chat, code-assistant"
                disabled={!!editingModel}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier (cannot be changed after creation)
              </p>
            </div>
            <div>
              <Label htmlFor="model">OpenAI Model *</Label>
              <Input
                id="model"
                value={modelForm.model}
                onChange={(e) => setModelForm({ ...modelForm, model: e.target.value })}
                placeholder="e.g., gpt-4, gpt-3.5-turbo"
              />
            </div>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={modelForm.title}
                onChange={(e) => setModelForm({ ...modelForm, title: e.target.value })}
                placeholder="Model display title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={modelForm.description}
                onChange={(e) => setModelForm({ ...modelForm, description: e.target.value })}
                placeholder="Model description"
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={modelForm.icon}
                onChange={(e) => setModelForm({ ...modelForm, icon: e.target.value })}
                placeholder="Icon identifier or emoji"
              />
            </div>
            <div>
              <Label htmlFor="instructions">System Instructions *</Label>
              <Textarea
                id="instructions"
                value={modelForm.instructions}
                onChange={(e) => setModelForm({ ...modelForm, instructions: e.target.value })}
                placeholder="System instructions for the model"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModelDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveModel}>Save Model</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suggestion Dialog */}
      <Dialog open={suggestionDialogOpen} onOpenChange={setSuggestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSuggestion ? 'Edit' : 'Create'} Suggestion</DialogTitle>
            <DialogDescription>
              Add a conversation starter suggestion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Suggestion Text</Label>
              <Textarea
                id="text"
                value={suggestionForm.text}
                onChange={(e) => setSuggestionForm({ ...suggestionForm, text: e.target.value })}
                placeholder="Enter suggestion text"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Select
                value={suggestionForm.modelId ? String(suggestionForm.modelId) : ''}
                onValueChange={(value) =>
                  setSuggestionForm({
                    ...suggestionForm,
                    modelId: value ? Number(value) : undefined,
                  })
                }
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select a model (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No model</SelectItem>
                  {models.map((model) => (
                    <SelectItem key={model._id} value={String(model._id)}>
                      {model.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={suggestionForm.order}
                onChange={(e) => setSuggestionForm({ ...suggestionForm, order: parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuggestionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSuggestion}>Save Suggestion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
