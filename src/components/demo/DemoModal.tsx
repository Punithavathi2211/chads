
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoModal = ({ isOpen, onClose }: DemoModalProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-center">
            CHADS Platform Demo
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 p-6">
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
            {!isVideoLoaded ? (
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold mb-2">Product Demo</h3>
                <p className="text-gray-300 mb-4">
                  Watch how CHADS makes chat marketing simple and compliant
                </p>
                <Button 
                  onClick={() => setIsVideoLoaded(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Demo
                </Button>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="animate-pulse mb-4">
                    <div className="h-4 bg-white/20 rounded w-64 mx-auto mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-48 mx-auto mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-56 mx-auto"></div>
                  </div>
                  <p className="text-lg">Demo video would play here</p>
                  <p className="text-sm text-white/80 mt-2">
                    In a real implementation, this would be a video player
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 text-white border-white hover:bg-white hover:text-gray-900"
                    onClick={() => setIsVideoLoaded(false)}
                  >
                    Reset Demo
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">No-Code Builder</h4>
              <p className="text-gray-600">Drag & drop campaign creation</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Multi-Platform</h4>
              <p className="text-gray-600">WhatsApp, SMS, Messenger & more</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Compliance First</h4>
              <p className="text-gray-600">GDPR & TCPA compliant</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
