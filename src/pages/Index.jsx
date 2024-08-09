import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ThumbsUp } from 'lucide-react';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) return <div className="text-center text-red-500">An error occurred: {error.message}</div>;

  return (
    <div className="min-h-screen p-8 bg-blue-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Top 100 Hacker News Stories</h1>
      <div className="max-w-3xl mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>
      <div className="grid gap-4 max-w-3xl mx-auto">
        {isLoading ? (
          Array(10).fill().map((_, index) => (
            <Card key={index} className="animate-pulse bg-blue-100">
              <CardHeader>
                <CardTitle className="h-6 bg-blue-200 rounded"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-blue-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-blue-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredStories.map(story => (
            <Card key={story.objectID} className="bg-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-800">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ThumbsUp className="mr-2 h-4 w-4 text-blue-600" />
                    <span className="text-blue-700">{story.points} points</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <a href={story.url} target="_blank" rel="noopener noreferrer">
                      Read More <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
