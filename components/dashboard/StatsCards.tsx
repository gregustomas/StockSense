import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatsCard {
  title: string;
  value: number;
  className?: string;
}

interface StatsCardsProps {
  cards: StatsCard[];
}

export function StatsCards({ cards }: StatsCardsProps) {
  return (
    <>
      {/* desktop */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${card.className ?? ""}`}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* mobile */}
      <div className="flex md:hidden gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory">
        {cards.map((card) => (
          <Card key={card.title} className="flex-none w-[70%] snap-start">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${card.className ?? ""}`}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
