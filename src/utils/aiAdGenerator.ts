
// Mock AI ad generator - in a real app, this would call an AI service like OpenAI
export const generateAdContent = async (title: string, description: string, platform: string): Promise<{
  message: string;
  suggestions: string[];
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const platformEmojis = {
    whatsapp: '📱',
    messenger: '💬',
    sms: '📨',
    email: '📧'
  };
  
  const emoji = platformEmojis[platform as keyof typeof platformEmojis] || '📢';
  
  // Generate different ad variations based on input
  const adTemplates = [
    `${emoji} ${title}\n\n${description}\n\nDon't miss out on this amazing opportunity! Get started today.`,
    `🌟 ${title} 🌟\n\n${description}\n\nLimited time offer - Act now!`,
    `${emoji} Discover ${title.toLowerCase()}\n\n${description}\n\nJoin thousands of satisfied customers. Learn more today!`,
    `${emoji} ${title}\n\n✨ ${description}\n\n🎯 Perfect for you!\n💫 Available now`,
    `🚀 ${title}\n\n${description}\n\n✅ Trusted by professionals\n✅ Easy to get started\n✅ Results guaranteed`
  ];
  
  // Select a random template and customize it
  const selectedTemplate = adTemplates[Math.floor(Math.random() * adTemplates.length)];
  
  // Generate additional suggestions
  const suggestions = [
    "Try adding customer testimonials for better credibility",
    "Consider including a limited-time offer to create urgency",
    "Add emojis to make your message more engaging",
    "Include a clear call-to-action button",
    "Mention specific benefits or features"
  ];
  
  return {
    message: selectedTemplate,
    suggestions: suggestions.slice(0, 3) // Return 3 random suggestions
  };
};
