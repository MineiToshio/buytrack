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

type OrdersByMonthChartProps = {
  data: OrderPaymentByMonth[];
};

const OrdersByMonthChart: FC<OrdersByMonthChartProps> = ({ data }) => (
  <div className="flex flex-col mb-4 w-full">
    <Typography className="font-semibold">
      PRODUCTOS PEDIDOS VS ENTREGADOS
    </Typography>
    <Typography size="sm" className="mb-6">
      Este gráfico compara la cantidad de productos pedidos con la cantidad de
      productos entregados en los últimos 12 meses.
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
          allowDecimals={false}
          type="number"
          domain={[0, "dataMax"]}
        />
        <Tooltip />
        <Legend wrapperStyle={{ bottom: -16 }} />
        <Area
          type="monotone"
          dataKey="productsOrderCount"
          stroke={colors.primary.light}
          fill="url(#colorOrder)"
          fillOpacity={1}
          activeDot={{ r: 6 }}
          name="Pedidos"
        />
        <Area
          type="monotone"
          dataKey="productsDeliveryCount"
          stroke={colors.secondary.light}
          fill="url(#colorDelivery)"
          fillOpacity={1}
          activeDot={{ r: 6 }}
          name="Entregas"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default OrdersByMonthChart;
