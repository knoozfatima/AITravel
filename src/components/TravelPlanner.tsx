
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, DollarSign, Heart, Plane, Loader2, Sparkles, Star } from 'lucide-react';
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

  // Using the provided API key directly
  const apiKey = 'AIzaSyCI-7LdZaGTHP5QrTEInsf0OitWAr8Ej7g';

  const handleInputChange = (field: keyof TravelInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        description: "Failed to generate travel plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
      {/* Enhanced Header with animations */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 animate-fade-in">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-xl bg-primary/10 animate-glow">
              <Plane className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Travel Planner Pro
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">AI-Powered Intelligence</span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Transform your travel dreams into reality with intelligent planning
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Enhanced Planning Form */}
          <div className="space-y-6 animate-slide-up">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 animate-pulse-border">
              <CardHeader className="pb-6 bg-gradient-to-r from-primary/5 to-accent/10">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  Trip Details
                  <Star className="w-5 h-5 text-primary animate-pulse" />
                </CardTitle>
                <CardDescription className="text-base">
                  Share your travel preferences and let our AI craft the perfect journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Location Inputs with enhanced styling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="source" className="text-sm font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        Departure City
                      </Label>
                      <Input
                        id="source"
                        placeholder="New York, NY"
                        value={inputs.source}
                        onChange={(e) => handleInputChange('source', e.target.value)}
                        className="h-12 border-2 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="destination" className="text-sm font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        Destination
                      </Label>
                      <Input
                        id="destination"
                        placeholder="Paris, France"
                        value={inputs.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                        className="h-12 border-2 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Date Inputs with enhanced styling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="startDate" className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Departure Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={inputs.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="h-12 border-2 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="endDate" className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Return Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={inputs.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="h-12 border-2 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Budget and Travelers with enhanced styling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="budget" className="text-sm font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Budget (USD)
                      </Label>
                      <Input
                        id="budget"
                        placeholder="$2,000"
                        value={inputs.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="h-12 border-2 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="travelers" className="text-sm font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Number of Travelers
                      </Label>
                      <Input
                        id="travelers"
                        type="number"
                        min="1"
                        max="20"
                        value={inputs.travelers}
                        onChange={(e) => handleInputChange('travelers', parseInt(e.target.value) || 1)}
                        className="h-12 border-2 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Interests with enhanced styling */}
                  <div className="space-y-3">
                    <Label htmlFor="interests" className="text-sm font-semibold flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      Interests & Preferences
                    </Label>
                    <Textarea
                      id="interests"
                      placeholder="Museums, local cuisine, adventure activities, cultural experiences, nightlife, nature, photography..."
                      value={inputs.interests}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      className="resize-none min-h-[120px] border-2 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      rows={5}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-[1.02] animate-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Crafting Your Perfect Journey...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-3" />
                        Generate Travel Plan
                        <Plane className="w-6 h-6 ml-3" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Results Panel */}
          <div className="space-y-6 animate-slide-up">
            <Card className="h-fit border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-6 bg-gradient-to-r from-accent/10 to-primary/5">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  Your Personalized Itinerary
                </CardTitle>
                <CardDescription className="text-base">
                  AI-generated travel plan tailored specifically for you
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-muted animate-pulse"></div>
                      <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
                      <div className="w-16 h-16 rounded-full border-2 border-accent border-b-transparent animate-spin absolute top-2 left-2"></div>
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-lg font-semibold text-primary">Creating Your Perfect Adventure</p>
                      <p className="text-sm text-muted-foreground">Our AI is analyzing the best options for you...</p>
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                ) : travelPlan ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-semibold text-green-600 flex items-center gap-2">
                          Plan Generated Successfully
                          <Sparkles className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-muted/30 to-accent/20 rounded-xl p-8 border-2 border-primary/20 max-h-[700px] overflow-y-auto animate-glow">
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-foreground">
                          {travelPlan}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                    <div className="p-6 rounded-full bg-gradient-to-br from-muted/50 to-accent/30 animate-pulse-border">
                      <Plane className="w-12 h-12 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-lg font-semibold text-primary">Ready to Explore the World?</p>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Fill out the form on the left to generate your personalized travel itinerary with AI precision
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-xs text-primary font-medium">Powered by Advanced AI</span>
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      </div>
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
