"use client";

import Typography from "@/components/core/Typography";
import { OrderPaymentByMonth } from "@/queries/dashboard";
import colors from "@/styles/colors";
import { FC } from "react";
import {
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from "recharts";

type OrderCostVsPaidAmountChartProps = {
  data: OrderPaymentByMonth[];
  currency?: string;
};

const OrderCostVsPaidAmountChart: FC<OrderCostVsPaidAmountChartProps> = ({
  data,
  currency,
}) => {
  console.log(data);
  return (
    <div className="flex flex-col mb-4 w-full">
      <Typography className="font-semibold">
        COSTO DE LAS ÓRDENES VS MONTO PAGADO
      </Typography>
      <Typography size="sm" className="mb-6">
        Este gráfico compara el costo de las órdenes con la cantidad pagada
        durante los últimos 12 meses.
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colors.primary.light}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={colors.primary.light}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colors.secondary.light}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={colors.secondary.light}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthLabel" angle={-90} textAnchor="end" />
          <YAxis
            width={30}
            allowDecimals
            type="number"
            domain={[0, "dataMax"]}
          />
          <Tooltip formatter={(value) => `${currency}${value}`} />
          <Legend wrapperStyle={{ bottom: -16 }} />
          <Area
            type="monotone"
            dataKey="cost"
            stroke={colors.primary.light}
            fill="url(#colorOrder)"
            fillOpacity={1}
            activeDot={{ r: 6 }}
            name="Monto Pedido"
          />
          <Area
            type="monotone"
            dataKey="paidAmount"
            stroke={colors.secondary.light}
            fill="url(#colorDelivery)"
            fillOpacity={1}
            activeDot={{ r: 6 }}
            name="Monto Pagado"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default OrderCostVsPaidAmountChart;
