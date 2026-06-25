import { DAMAGE } from '@/lib/constants';
import type { DamageLevel } from '@/lib/types';

const order: DamageLevel[] = ['alto', 'medio', 'bajo', 'sin_datos'];

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="font-medium text-gray-600">Nivel de afectación:</span>
      {order.map((lvl) => (
        <span key={lvl} className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: DAMAGE[lvl].color }}
          />
          {DAMAGE[lvl].label}
        </span>
      ))}
    </div>
  );
}
