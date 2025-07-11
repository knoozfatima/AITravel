
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, DollarSign, Heart, Plane, Loader2 } from 'lucide-react';
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Plane className="w-8 h-8 text-white" />
          <h1 className="text-4xl font-bold text-white">Journey Gemini Whisperer</h1>
        </div>
        <p className="text-white/90 text-lg">AI-powered travel planning for your perfect adventure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Plan Your Journey
            </CardTitle>
            <CardDescription className="text-white/80">
              Tell us about your dream trip and let AI create the perfect itinerary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* API Key Input */}
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-white">Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
              <p className="text-xs text-white/70">
                Get your API key from{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Source */}
              <div className="space-y-2">
                <Label htmlFor="source" className="text-white">From (Source)</Label>
                <Input
                  id="source"
                  placeholder="e.g., New York, NY"
                  value={inputs.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-white">To (Destination)</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Paris, France"
                  value={inputs.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-white flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={inputs.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-white">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={inputs.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-white flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Budget (USD)
                </Label>
                <Input
                  id="budget"
                  placeholder="e.g., $2000"
                  value={inputs.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>

              {/* Number of Travelers */}
              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-white flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Number of Travelers
                </Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={inputs.travelers}
                  onChange={(e) => handleInputChange('travelers', parseInt(e.target.value) || 1)}
                  className="bg-white/20 border-white/30 text-white"
                />
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label htmlFor="interests" className="text-white flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  Interests & Preferences
                </Label>
                <Textarea
                  id="interests"
                  placeholder="e.g., museums, food tours, adventure sports, nightlife, nature..."
                  value={inputs.interests}
                  onChange={(e) => handleInputChange('interests', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 resize-none"
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Your Perfect Trip...
                  </>
                ) : (
                  <>
                    <Plane className="w-4 h-4 mr-2" />
                    Generate Travel Plan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Travel Plan Display */}
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Your Travel Plan</CardTitle>
            <CardDescription className="text-white/80">
              AI-generated itinerary tailored just for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <p className="text-white/80">Creating your perfect travel plan...</p>
              </div>
            ) : travelPlan ? (
              <div className="prose prose-invert max-w-none">
                <div className="bg-white/20 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-white text-sm font-mono">
                    {travelPlan}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-white/60">
                <Plane className="w-12 h-12" />
                <p>Fill out the form to generate your travel plan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TravelPlanner;
