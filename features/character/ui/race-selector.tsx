import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import races from "../data/races.json";

type RaceSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RaceSelector({
  value,
  onChange,
}: RaceSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Race</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {races.map((race) => {
            const selected = value === race.id;

            return (
              <Card
                key={race.id}
                onClick={() => onChange(race.id)}
                className={cn(
                  "pt-0 cursor-pointer overflow-hidden transition-all",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  selected && "ring-2 ring-primary",
                )}
              >
                <div className="relative aspect-4/3">
                  <Image
                    src={race.image}
                    alt={race.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent>
                  <p className="text-sm font-medium">
                    {race.name}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}