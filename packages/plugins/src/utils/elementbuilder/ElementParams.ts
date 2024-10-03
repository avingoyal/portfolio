import {
  PortfolioElementLabel,
  PortfolioElementTypeType,
} from '@avingoyal01/portfolio-core';

export type ElementParams = {
  type: PortfolioElementTypeType;
  label: PortfolioElementLabel;
  name?: string;
  tags?: string[];
};
