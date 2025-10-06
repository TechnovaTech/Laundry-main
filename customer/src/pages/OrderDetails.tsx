import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Shirt, Clock, Package, Truck, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const OrderDetails = () => {
  const navigate = useNavigate();

  const timeline = [
    { icon: Clock, label: "Scheduled - 16 Sep, 10:00", completed: true },
    { icon: Package, label: "Picked Up - 16 Sep, 11:05", completed: true },
    { icon: Shirt, label: "Ironing Started - 16 Sep, 02:30", completed: true, active: true },
    { icon: Truck, label: "Out for Delivery - 16 Sep, 05:45", completed: false },
    { icon: CheckCircle2, label: "Delivered - 16 Sep, 06:20", completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between z-10">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold flex-1 text-center mx-4">Track Order</h1>
        <button className="flex-shrink-0">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Card className="p-3 sm:p-4 rounded-2xl border-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm sm:text-base">Order</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">3 Shirts, 2 Trousers</p>
                <p className="text-base sm:text-lg font-bold text-primary">₹180</p>
              </div>
            </div>
            <span className="px-2 sm:px-4 py-1 sm:py-1.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-full flex-shrink-0">
              In Progress
            </span>
          </div>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.completed
                      ? item.active
                        ? "bg-primary"
                        : "bg-primary"
                      : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      item.completed ? "text-white" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm sm:text-base ${
                      item.active ? "text-primary" : item.completed ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Card className="p-3 sm:p-4 rounded-2xl border-2 bg-muted/50">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Estimated delivery: 16 Sep, 6:30-7:00 PM
          </p>
        </Card>

        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-xs sm:text-sm">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Contact Partner
          </Button>
          <Button variant="destructive" className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-xs sm:text-sm">
            ⚠ Report Issue
          </Button>
        </div>

        <Button className="w-full h-10 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base">
          <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Download Invoice ⚙
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
