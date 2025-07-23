
// Mock AI compliance checker - in a real app, this would call an AI service
export const checkAdCompliance = async (message: string, platform: string): Promise<{
  isCompliant: boolean;
  rejectionReason?: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simple compliance rules for demonstration
  const prohibitedWords = ['win instantly', 'guaranteed', 'click now!!!', 'free money', 'urgent!!!'];
  const suspiciousPatterns = [
    /\$[\d,]+.*instant/i,
    /click.*now.*!/i,
    /win.*\$[\d,]+/i,
    /guaranteed.*money/i
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check for prohibited words
  for (const word of prohibitedWords) {
    if (lowerMessage.includes(word.toLowerCase())) {
      return {
        isCompliant: false,
        rejectionReason: `Content violates advertising standards: contains prohibited phrase "${word}". Please revise your message to comply with platform policies.`
      };
    }
  }
  
  // Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      return {
        isCompliant: false,
        rejectionReason: "Content violates advertising standards: misleading prize claims and excessive use of urgent language. Please ensure your message is truthful and not overly promotional."
      };
    }
  }
  
  // Check message length based on platform
  const maxLengths = {
    sms: 160,
    whatsapp: 4096,
    messenger: 2000,
    email: 10000
  };
  
  const maxLength = maxLengths[platform as keyof typeof maxLengths] || 2000;
  if (message.length > maxLength) {
    return {
      isCompliant: false,
      rejectionReason: `Message exceeds maximum length for ${platform} (${message.length}/${maxLength} characters).`
    };
  }
  
  return { isCompliant: true };
};
