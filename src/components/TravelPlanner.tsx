
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, DollarSign, Heart, Plane, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateTravelPlan } from '@/utils/geminiApi';

interface TravelInputs {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  interests: string;
}

const TravelPlanner = () => {
  const [inputs, setInputs] = useState<TravelInputs>({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
    interests: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleInputChange = (field: keyof TravelInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to generate travel plans.",
        variant: "destructive"
      });
      return;
    }

    if (!inputs.source || !inputs.destination || !inputs.startDate || !inputs.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const plan = await generateTravelPlan(inputs, apiKey);
      setTravelPlan(plan);
      toast({
        title: "Travel Plan Generated!",
        description: "Your personalized travel itinerary is ready.",
      });
    } catch (error) {
      console.error('Error generating travel plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate travel plan. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Travel Planner Pro</h1>
          </div>
          <p className="text-muted-foreground text-lg">AI-powered intelligent travel planning for your next adventure</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Planning Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="w-5 h-5 text-primary" />
                  Trip Details
                </CardTitle>
                <CardDescription>
                  Provide your travel preferences and let our AI create the perfect itinerary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Key Section */}
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="space-y-3">
                    <Label htmlFor="apiKey" className="text-sm font-medium">Gemini API Key</Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type={showApiKey ? "text" : "password"}
                        placeholder="Enter your Gemini API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get your free API key from{' '}
                      <a 
                        href="https://makersuite.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        Google AI Studio
                      </a>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Location Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source" className="text-sm font-medium">From</Label>
                      <Input
                        id="source"
                        placeholder="New York, NY"
                        value={inputs.source}
                        onChange={(e) => handleInputChange('source', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination" className="text-sm font-medium">To</Label>
                      <Input
                        id="destination"
                        placeholder="Paris, France"
                        value={inputs.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Date Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Departure Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={inputs.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm font-medium">Return Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={inputs.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Budget and Travelers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-sm font-medium flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Budget (USD)
                      </Label>
                      <Input
                        id="budget"
                        placeholder="$2,000"
                        value={inputs.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="travelers" className="text-sm font-medium flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Travelers
                      </Label>
                      <Input
                        id="travelers"
                        type="number"
                        min="1"
                        max="20"
                        value={inputs.travelers}
                        onChange={(e) => handleInputChange('travelers', parseInt(e.target.value) || 1)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="space-y-2">
                    <Label htmlFor="interests" className="text-sm font-medium flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      Interests & Preferences
                    </Label>
                    <Textarea
                      id="interests"
                      placeholder="Museums, local cuisine, adventure activities, cultural experiences, nightlife, nature..."
                      value={inputs.interests}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      className="resize-none min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Your Travel Plan...
                      </>
                    ) : (
                      <>
                        <Plane className="w-5 h-5 mr-2" />
                        Generate Travel Plan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <Card className="h-fit">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl">Your Personalized Itinerary</CardTitle>
                <CardDescription>
                  AI-generated travel plan tailored to your preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-muted"></div>
                      <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-base font-medium">Creating your perfect travel plan</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments...</p>
                    </div>
                  </div>
                ) : travelPlan ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">Plan Generated</span>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6 border max-h-[600px] overflow-y-auto">
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-foreground">
                          {travelPlan}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                    <div className="p-4 rounded-full bg-muted/50">
                      <Plane className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-base font-medium">Ready to plan your trip?</p>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Fill out the form on the left to generate your personalized travel itinerary
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanner;
