import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import classes from "../data/classes.json";

type ClassSelectorProps = {
  value: string;
  subclass: string;
  onClassChange: (value: string) => void;
  onSubclassChange: (value: string) => void;
};

export function ClassSelector({
  value,
  subclass,
  onClassChange,
  onSubclassChange,
}: ClassSelectorProps) {
  const selectedClass = classes.find(
    (item) => item.id === value,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {classes.map((item) => {
            const selected = value === item.id;

            return (
              <Card
                key={item.id}
                onClick={() => {
                  onClassChange(item.id);
                  onSubclassChange("");
                }}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all",
                  "hover:-translate-y-0.5 hover:shadow-md pt-0",
                  selected && "ring-2 ring-primary",
                )}
              >
                <div className="relative aspect-4/3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent>
                  <p className="text-sm font-medium">
                    {item.name}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedClass && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">
                Subclass
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose your character's subclass.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {selectedClass.subclasses.map((item) => {
                const selected = subclass === item;

                return (
                  <Card
                    key={item}
                    onClick={() => onSubclassChange(item)}
                    className={cn(
                      "cursor-pointer transition-all",
                      "hover:-translate-y-0.5 hover:shadow-md",
                      selected && "ring-2 ring-primary",
                    )}
                  >
                    <CardContent className="p-4">
                      <p className="font-medium">
                        {item}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}