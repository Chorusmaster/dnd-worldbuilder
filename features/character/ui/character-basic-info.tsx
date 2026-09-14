import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageInput } from "@/components/ui/image-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import backgrounds from "../data/backgrounds.json";
import alignments from "../data/alignments.json";

type CharacterBasicInfoProps = {
  value: {
    name: string;
    description: string;
    image: string;
    level: number;
    background: string;
    alignment: string;
    experiencePoints: number;
  };

  onChange: (
    field:
      | "name"
      | "description"
      | "image"
      | "level"
      | "background"
      | "alignment"
      | "experiencePoints",
    value: string | number,
  ) => void;
};

export function CharacterBasicInfo({
  value,
  onChange,
}: CharacterBasicInfoProps) {
  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle>Basic information</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label="Name"
          value={value.name}
          placeholder="Character name"
          className="sm:col-span-2 lg:col-span-3"
          onChange={(value) => onChange("name", value)}
        />

        <div className="flex justify-center sm:col-span-2 lg:col-span-1 lg:row-span-3 lg:justify-end">
          <ImageInput
            className="h-48 w-full sm:h-56 lg:size-64"
            value={value.image}
            onChange={(value) => onChange("image", value)}
          />
        </div>

        <Field
          label="Description"
          value={value.description}
          placeholder="Character description..."
          className="sm:col-span-2 lg:col-span-3 lg:row-span-2"
          onChange={(value) => onChange("description", value)}
          textarea
        />

        <Field
          label="Level"
          type="number"
          value={value.level}
          onChange={(value) => onChange("level", Number(value))}
        />

        <Field
          label="Experience"
          type="number"
          value={value.experiencePoints}
          onChange={(value) => onChange("experiencePoints", Number(value))}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Background
          </label>

          <Select
            value={value.background}
            onValueChange={(value) => onChange("background", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select background"
                children={
                  backgrounds.find(
                    (background) => background.value === value.background,
                  )?.label
                }
              />
            </SelectTrigger>

            <SelectContent>
              {backgrounds.map((background) => (
                <SelectItem
                  key={background.value}
                  value={background.value}
                >
                  {background.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Alignment
          </label>

          <Select
            value={value.alignment}
            onValueChange={(value) => onChange("alignment", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select alignment"
                children={
                  alignments.find(
                    (alignment) => alignment.value === value.alignment,
                  )?.label
                }
              />
            </SelectTrigger>

            <SelectContent>
              {alignments.map((alignment) => (
                <SelectItem
                  key={alignment.value}
                  value={alignment.value}
                >
                  {alignment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
  textarea = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  textarea?: boolean;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <label className="text-sm font-medium">
        {label}
      </label>

      {textarea ? (
        <Textarea
          value={value}
          className="min-h-40 max-h-40"
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}