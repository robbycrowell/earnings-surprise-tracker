import { useState, useMemo, useCallback } from "react";

const DEFAULT_TICKERS = ["AAPL","MSFT","GOOGL","AMZN","NVDA","META","TSLA","JPM","GS","NFLX","LLY","AMD","DIS","JNJ","V","MA","BAC","UNH","HD","CRM","XOM","PG","WMT","COST"];

const SAMPLE_DATA = [
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2026-07-30",epsEstimate:1.89,epsActual:2.02,priceBefore:232.5,priceAfter1D:237.8,priceAfter5D:235.2 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2026-04-30",epsEstimate:1.94,epsActual:2.01,priceBefore:211.21,priceAfter1D:216.59,priceAfter5D:213.07 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2026-01-30",epsEstimate:2.67,epsActual:2.84,priceBefore:224.97,priceAfter1D:236.0,priceAfter5D:232.8 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2025-10-30",epsEstimate:1.77,epsActual:1.85,priceBefore:233.4,priceAfter1D:228.87,priceAfter5D:227.48 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2025-08-01",epsEstimate:1.43,epsActual:1.57,priceBefore:217.96,priceAfter1D:222.64,priceAfter5D:226.4 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2025-05-01",epsEstimate:1.62,epsActual:1.65,priceBefore:209.07,priceAfter1D:211.21,priceAfter5D:207.21 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2025-01-30",epsEstimate:2.34,epsActual:2.4,priceBefore:239.37,priceAfter1D:236.0,priceAfter5D:228.01 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2024-10-31",epsEstimate:1.6,epsActual:1.64,priceBefore:229.04,priceAfter1D:225.91,priceAfter5D:222.72 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2024-08-01",epsEstimate:1.35,epsActual:1.4,priceBefore:218.24,priceAfter1D:222.08,priceAfter5D:209.27 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2024-05-02",epsEstimate:1.5,epsActual:1.53,priceBefore:169.3,priceAfter1D:173.03,priceAfter5D:183.38 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2024-02-01",epsEstimate:2.1,epsActual:2.18,priceBefore:186.86,priceAfter1D:185.04,priceAfter5D:187.68 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2023-11-02",epsEstimate:1.39,epsActual:1.46,priceBefore:171.1,priceAfter1D:176.65,priceAfter5D:189.33 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2023-08-03",epsEstimate:1.19,epsActual:1.26,priceBefore:195.83,priceAfter1D:191.17,priceAfter5D:181.99 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2023-05-04",epsEstimate:1.43,epsActual:1.52,priceBefore:167.45,priceAfter1D:173.57,priceAfter5D:172.57 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2023-02-02",epsEstimate:1.94,epsActual:1.88,priceBefore:145.43,priceAfter1D:150.82,priceAfter5D:151.73 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2022-10-27",epsEstimate:1.27,epsActual:1.29,priceBefore:149.35,priceAfter1D:155.74,priceAfter5D:138.38 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2022-07-28",epsEstimate:1.16,epsActual:1.2,priceBefore:156.79,priceAfter1D:162.51,priceAfter5D:164.87 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2022-04-28",epsEstimate:1.43,epsActual:1.52,priceBefore:163.64,priceAfter1D:157.65,priceAfter5D:156.77 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2022-01-27",epsEstimate:1.89,epsActual:2.1,priceBefore:159.22,priceAfter1D:170.33,priceAfter5D:174.78 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2021-10-28",epsEstimate:1.24,epsActual:1.24,priceBefore:149.32,priceAfter1D:152.57,priceAfter5D:150.44 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2026-07-22",epsEstimate:0.44,epsActual:0.33,priceBefore:363.5,priceAfter1D:340.22,priceAfter5D:345.8 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2026-04-28",epsEstimate:0.3,epsActual:0.41,priceBefore:252.3,priceAfter1D:268.44,priceAfter5D:275.9 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2026-01-28",epsEstimate:0.4,epsActual:0.5,priceBefore:389.1,priceAfter1D:366.42,priceAfter5D:352.56 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2025-10-22",epsEstimate:0.5,epsActual:0.5,priceBefore:218.63,priceAfter1D:240.06,priceAfter5D:257.8 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2025-07-22",epsEstimate:0.37,epsActual:0.34,priceBefore:252.75,priceAfter1D:264.88,priceAfter5D:258.4 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2025-04-22",epsEstimate:0.41,epsActual:0.27,priceBefore:237.71,priceAfter1D:224.44,priceAfter5D:278.3 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2025-01-29",epsEstimate:0.77,epsActual:0.73,priceBefore:398.09,priceAfter1D:376.38,priceAfter5D:361.62 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2024-10-23",epsEstimate:0.58,epsActual:0.72,priceBefore:213.65,priceAfter1D:234.12,priceAfter5D:248.93 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2024-07-23",epsEstimate:0.62,epsActual:0.52,priceBefore:246.38,priceAfter1D:225.01,priceAfter5D:218.24 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2024-04-23",epsEstimate:0.51,epsActual:0.45,priceBefore:144.68,priceAfter1D:157.19,priceAfter5D:168.29 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2024-01-24",epsEstimate:0.75,epsActual:0.71,priceBefore:207.83,priceAfter1D:191.59,priceAfter5D:187.91 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2023-10-18",epsEstimate:0.72,epsActual:0.66,priceBefore:255.7,priceAfter1D:220.89,priceAfter5D:207.38 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2023-07-19",epsEstimate:0.82,epsActual:0.91,priceBefore:293.34,priceAfter1D:291.26,priceAfter5D:265.28 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2023-04-19",epsEstimate:0.85,epsActual:0.85,priceBefore:180.13,priceAfter1D:162.99,priceAfter5D:164.31 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2023-01-25",epsEstimate:1.13,epsActual:1.19,priceBefore:143.75,priceAfter1D:160.27,priceAfter5D:189.98 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2022-10-19",epsEstimate:0.99,epsActual:1.05,priceBefore:222.04,priceAfter1D:214.62,priceAfter5D:209.66 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2022-07-20",epsEstimate:0.6,epsActual:0.76,priceBefore:721.82,priceAfter1D:815.12,priceAfter5D:891.29 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2022-04-20",epsEstimate:0.75,epsActual:1.07,priceBefore:1005.05,priceAfter1D:1008.78,priceAfter5D:870.76 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2026-04-29",epsEstimate:3.22,epsActual:3.46,priceBefore:394.04,priceAfter1D:422.32,priceAfter5D:430.8 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2026-01-29",epsEstimate:3.86,epsActual:4.14,priceBefore:442.0,priceAfter1D:440.62,priceAfter5D:410.18 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2025-10-29",epsEstimate:3.66,epsActual:4.13,priceBefore:431.95,priceAfter1D:410.41,priceAfter5D:415.57 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2025-07-22",epsEstimate:3.37,epsActual:3.65,priceBefore:438.7,priceAfter1D:425.11,priceAfter5D:418.3 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2025-04-30",epsEstimate:3.21,epsActual:3.46,priceBefore:394.04,priceAfter1D:422.32,priceAfter5D:430.8 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2025-01-29",epsEstimate:3.11,epsActual:3.23,priceBefore:442.0,priceAfter1D:440.62,priceAfter5D:410.18 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2024-10-30",epsEstimate:3.1,epsActual:3.3,priceBefore:431.95,priceAfter1D:410.41,priceAfter5D:415.57 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2024-07-30",epsEstimate:2.93,epsActual:2.95,priceBefore:422.92,priceAfter1D:417.0,priceAfter5D:399.67 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2024-04-25",epsEstimate:2.83,epsActual:2.94,priceBefore:399.04,priceAfter1D:406.32,priceAfter5D:414.8 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2024-01-30",epsEstimate:2.78,epsActual:2.93,priceBefore:404.87,priceAfter1D:408.59,priceAfter5D:405.49 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2023-10-24",epsEstimate:2.65,epsActual:2.99,priceBefore:329.82,priceAfter1D:346.07,priceAfter5D:369.67 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2023-07-25",epsEstimate:2.55,epsActual:2.69,priceBefore:345.24,priceAfter1D:327.78,priceAfter5D:325.12 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2023-04-25",epsEstimate:2.23,epsActual:2.45,priceBefore:281.77,priceAfter1D:295.37,priceAfter5D:307.26 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2023-01-24",epsEstimate:2.29,epsActual:2.32,priceBefore:242.04,priceAfter1D:248.16,priceAfter5D:252.75 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2022-10-25",epsEstimate:2.3,epsActual:2.35,priceBefore:250.66,priceAfter1D:227.87,priceAfter5D:228.87 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2022-07-26",epsEstimate:2.29,epsActual:2.23,priceBefore:261.28,priceAfter1D:268.74,priceAfter5D:282.91 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2022-04-26",epsEstimate:2.19,epsActual:2.22,priceBefore:280.72,priceAfter1D:270.22,priceAfter5D:264.58 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2022-01-25",epsEstimate:2.31,epsActual:2.48,priceBefore:296.03,priceAfter1D:288.49,priceAfter5D:305.94 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2026-04-29",epsEstimate:6.63,epsActual:7.29,priceBefore:548.2,priceAfter1D:572.4,priceAfter5D:580.3 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2026-01-29",epsEstimate:8.19,epsActual:8.88,priceBefore:612.0,priceAfter1D:636.5,priceAfter5D:641.2 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2025-10-29",epsEstimate:6.66,epsActual:7.25,priceBefore:575.3,priceAfter1D:589.2,priceAfter5D:598.4 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2025-07-30",epsEstimate:5.87,epsActual:7.14,priceBefore:508.2,priceAfter1D:518.6,priceAfter5D:536.8 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2025-04-30",epsEstimate:5.28,epsActual:6.43,priceBefore:536.7,priceAfter1D:586.1,priceAfter5D:612.4 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2025-01-29",epsEstimate:6.77,epsActual:8.02,priceBefore:668.3,priceAfter1D:692.1,priceAfter5D:704.8 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2024-10-30",epsEstimate:5.68,epsActual:6.03,priceBefore:576.81,priceAfter1D:559.14,priceAfter5D:572.41 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2024-07-31",epsEstimate:5.21,epsActual:5.31,priceBefore:504.72,priceAfter1D:471.91,priceAfter5D:506.28 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2024-04-24",epsEstimate:4.32,epsActual:5.33,priceBefore:493.5,priceAfter1D:442.46,priceAfter5D:463.5 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2024-02-01",epsEstimate:4.96,epsActual:5.33,priceBefore:394.78,priceAfter1D:474.99,priceAfter5D:473.28 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2023-10-25",epsEstimate:3.62,epsActual:4.39,priceBefore:318.68,priceAfter1D:301.27,priceAfter5D:332.45 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2023-07-26",epsEstimate:2.91,epsActual:2.98,priceBefore:316.0,priceAfter1D:321.35,priceAfter5D:302.93 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2023-04-26",epsEstimate:2.02,epsActual:2.2,priceBefore:209.4,priceAfter1D:238.29,priceAfter5D:241.14 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2023-02-01",epsEstimate:2.22,epsActual:1.76,priceBefore:148.97,priceAfter1D:188.77,priceAfter5D:178.35 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2022-10-26",epsEstimate:1.89,epsActual:1.64,priceBefore:135.1,priceAfter1D:97.94,priceAfter5D:96.72 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2022-07-27",epsEstimate:2.54,epsActual:2.46,priceBefore:169.58,priceAfter1D:160.72,priceAfter5D:167.1 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2026-02-26",epsEstimate:1.5,epsActual:1.62,priceBefore:131.28,priceAfter1D:130.01,priceAfter5D:120.42 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2025-11-20",epsEstimate:1.22,epsActual:1.3,priceBefore:141.95,priceAfter1D:144.82,priceAfter5D:138.63 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2025-08-27",epsEstimate:0.98,epsActual:1.04,priceBefore:124.58,priceAfter1D:127.79,priceAfter5D:118.91 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2025-05-28",epsEstimate:0.75,epsActual:0.96,priceBefore:131.29,priceAfter1D:139.2,priceAfter5D:142.84 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2025-02-26",epsEstimate:0.85,epsActual:0.89,priceBefore:131.0,priceAfter1D:124.6,priceAfter5D:120.06 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2024-11-20",epsEstimate:0.75,epsActual:0.81,priceBefore:144.02,priceAfter1D:146.67,priceAfter5D:138.3 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2024-08-28",epsEstimate:0.64,epsActual:0.68,priceBefore:125.61,priceAfter1D:117.59,priceAfter5D:108.22 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2024-05-22",epsEstimate:5.59,epsActual:6.12,priceBefore:949.5,priceAfter1D:1037.9,priceAfter5D:1064.2 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2024-02-21",epsEstimate:4.6,epsActual:5.16,priceBefore:694.52,priceAfter1D:785.38,priceAfter5D:822.79 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2023-11-21",epsEstimate:3.37,epsActual:4.02,priceBefore:499.44,priceAfter1D:482.23,priceAfter5D:467.7 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2023-08-23",epsEstimate:2.09,epsActual:2.7,priceBefore:471.63,priceAfter1D:471.16,priceAfter5D:487.84 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2023-05-24",epsEstimate:0.92,epsActual:1.09,priceBefore:305.38,priceAfter1D:379.8,priceAfter5D:393.27 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2023-02-22",epsEstimate:0.81,epsActual:0.88,priceBefore:236.64,priceAfter1D:232.13,priceAfter5D:231.41 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2022-11-16",epsEstimate:0.7,epsActual:0.58,priceBefore:164.15,priceAfter1D:160.96,priceAfter5D:164.98 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2022-08-24",epsEstimate:1.26,epsActual:0.51,priceBefore:178.51,priceAfter1D:157.36,priceAfter5D:139.37 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2026-04-29",epsEstimate:2.53,epsActual:5.11,priceBefore:157.22,priceAfter1D:170.32,priceAfter5D:174.6 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2026-02-04",epsEstimate:2.61,epsActual:2.82,priceBefore:192.3,priceAfter1D:193.1,priceAfter5D:190.8 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2025-10-29",epsEstimate:2.27,epsActual:2.87,priceBefore:169.2,priceAfter1D:178.6,priceAfter5D:182.3 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2025-07-29",epsEstimate:2.16,epsActual:2.31,priceBefore:166.8,priceAfter1D:170.2,priceAfter5D:164.1 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2025-04-24",epsEstimate:2.02,epsActual:2.81,priceBefore:157.48,priceAfter1D:168.3,priceAfter5D:172.8 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2025-02-04",epsEstimate:2.12,epsActual:2.15,priceBefore:199.42,priceAfter1D:189.41,priceAfter5D:183.2 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2024-10-29",epsEstimate:1.83,epsActual:2.12,priceBefore:165.27,priceAfter1D:172.7,priceAfter5D:169.24 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2024-07-23",epsEstimate:1.84,epsActual:1.89,priceBefore:177.16,priceAfter1D:171.94,priceAfter5D:163.38 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2024-04-25",epsEstimate:1.51,epsActual:1.89,priceBefore:158.87,priceAfter1D:174.6,priceAfter5D:177.29 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2024-01-30",epsEstimate:1.59,epsActual:1.64,priceBefore:141.8,priceAfter1D:142.04,priceAfter5D:147.74 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2023-10-24",epsEstimate:1.45,epsActual:1.55,priceBefore:138.81,priceAfter1D:125.02,priceAfter5D:131.86 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2023-07-25",epsEstimate:1.34,epsActual:1.44,priceBefore:122.29,priceAfter1D:130.43,priceAfter5D:131.38 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2023-04-25",epsEstimate:1.07,epsActual:1.17,priceBefore:104.8,priceAfter1D:107.62,priceAfter5D:120.32 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2023-02-02",epsEstimate:1.18,epsActual:1.05,priceBefore:102.09,priceAfter1D:105.22,priceAfter5D:94.02 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2022-10-25",epsEstimate:1.25,epsActual:1.06,priceBefore:104.93,priceAfter1D:94.82,priceAfter5D:86.49 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2026-01-15",epsEstimate:4.92,epsActual:5.23,priceBefore:242.8,priceAfter1D:253.1,priceAfter5D:256.4 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2025-10-15",epsEstimate:4.86,epsActual:5.07,priceBefore:226.5,priceAfter1D:233.1,priceAfter5D:237.8 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2025-07-11",epsEstimate:4.49,epsActual:4.96,priceBefore:261.0,priceAfter1D:268.4,priceAfter5D:265.2 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2025-04-11",epsEstimate:4.61,epsActual:5.07,priceBefore:234.5,priceAfter1D:246.2,priceAfter5D:250.8 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2025-01-15",epsEstimate:4.03,epsActual:4.81,priceBefore:234.6,priceAfter1D:248.1,priceAfter5D:253.2 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2024-10-11",epsEstimate:3.99,epsActual:4.37,priceBefore:210.8,priceAfter1D:220.4,priceAfter5D:224.1 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2024-07-12",epsEstimate:4.19,epsActual:4.4,priceBefore:205.54,priceAfter1D:209.32,priceAfter5D:214.68 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2024-04-12",epsEstimate:4.11,epsActual:4.44,priceBefore:191.59,priceAfter1D:189.49,priceAfter5D:193.86 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2024-01-12",epsEstimate:3.35,epsActual:3.97,priceBefore:172.64,priceAfter1D:171.71,priceAfter5D:186.19 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2023-10-13",epsEstimate:3.95,epsActual:4.33,priceBefore:148.88,priceAfter1D:150.42,priceAfter5D:149.2 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2023-07-14",epsEstimate:3.96,epsActual:4.37,priceBefore:150.62,priceAfter1D:156.8,priceAfter5D:155.42 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2023-04-14",epsEstimate:3.41,epsActual:4.1,priceBefore:135.53,priceAfter1D:138.72,priceAfter5D:137.06 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2026-01-15",epsEstimate:11.66,epsActual:14.01,priceBefore:548.2,priceAfter1D:582.4,priceAfter5D:590.1 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2025-10-15",epsEstimate:11.02,epsActual:12.25,priceBefore:504.2,priceAfter1D:536.8,priceAfter5D:548.2 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2025-07-14",epsEstimate:9.58,epsActual:10.91,priceBefore:514.8,priceAfter1D:522.1,priceAfter5D:528.6 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2025-04-14",epsEstimate:12.35,epsActual:14.12,priceBefore:504.6,priceAfter1D:542.8,priceAfter5D:558.1 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2025-01-15",epsEstimate:8.15,epsActual:11.95,priceBefore:548.2,priceAfter1D:582.4,priceAfter5D:590.1 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2024-10-15",epsEstimate:6.89,epsActual:8.4,priceBefore:497.2,priceAfter1D:536.78,priceAfter5D:548.22 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2024-07-15",epsEstimate:8.34,epsActual:8.62,priceBefore:463.28,priceAfter1D:498.63,priceAfter5D:510.24 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2024-04-15",epsEstimate:8.56,epsActual:11.58,priceBefore:396.32,priceAfter1D:418.46,priceAfter5D:440.89 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2024-01-16",epsEstimate:5.48,epsActual:5.48,priceBefore:387.64,priceAfter1D:377.92,priceAfter5D:382.41 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2023-10-17",epsEstimate:5.42,epsActual:5.47,priceBefore:322.08,priceAfter1D:318.63,priceAfter5D:345.82 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2023-07-19",epsEstimate:3.18,epsActual:3.08,priceBefore:346.11,priceAfter1D:350.28,priceAfter5D:337.48 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2026-04-29",epsEstimate:1.36,epsActual:1.59,priceBefore:188.0,priceAfter1D:198.4,priceAfter5D:196.2 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2026-02-06",epsEstimate:1.97,epsActual:1.95,priceBefore:218.5,priceAfter1D:231.4,priceAfter5D:228.9 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2025-10-30",epsEstimate:1.57,epsActual:1.95,priceBefore:192.8,priceAfter1D:198.6,priceAfter5D:202.1 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2025-07-31",epsEstimate:1.33,epsActual:1.68,priceBefore:186.4,priceAfter1D:193.2,priceAfter5D:188.7 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2025-05-01",epsEstimate:1.36,epsActual:1.59,priceBefore:188.0,priceAfter1D:198.4,priceAfter5D:196.2 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2025-02-06",epsEstimate:1.48,epsActual:1.86,priceBefore:235.4,priceAfter1D:225.8,priceAfter5D:218.6 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2024-10-31",epsEstimate:1.14,epsActual:1.43,priceBefore:186.19,priceAfter1D:197.93,priceAfter5D:205.71 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2024-08-01",epsEstimate:1.03,epsActual:1.26,priceBefore:186.99,priceAfter1D:176.42,priceAfter5D:170.06 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2024-04-30",epsEstimate:0.83,epsActual:1.13,priceBefore:179.0,priceAfter1D:191.7,priceAfter5D:186.21 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2024-02-01",epsEstimate:0.72,epsActual:1.0,priceBefore:159.28,priceAfter1D:171.81,priceAfter5D:174.4 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2023-10-26",epsEstimate:0.58,epsActual:0.94,priceBefore:127.74,priceAfter1D:133.09,priceAfter5D:143.44 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2023-07-27",epsEstimate:0.35,epsActual:0.65,priceBefore:128.91,priceAfter1D:128.34,priceAfter5D:133.43 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2023-04-27",epsEstimate:0.21,epsActual:0.31,priceBefore:105.45,priceAfter1D:110.36,priceAfter5D:119.46 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2023-02-02",epsEstimate:0.17,epsActual:0.03,priceBefore:103.39,priceAfter1D:103.39,priceAfter5D:100.55 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2026-07-16",epsEstimate:0.79,epsActual:0.80,priceBefore:74.20,priceAfter1D:74.68,priceAfter5D:75.10 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2026-04-17",epsEstimate:1.25,epsActual:1.23,priceBefore:962.4,priceAfter1D:1018.3,priceAfter5D:1042.5 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2026-01-21",epsEstimate:0.55,epsActual:0.56,priceBefore:872.4,priceAfter1D:910.3,priceAfter5D:925.6 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2025-10-16",epsEstimate:0.7,epsActual:0.59,priceBefore:758.2,priceAfter1D:810.4,priceAfter5D:828.1 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2025-07-17",epsEstimate:4.74,epsActual:4.88,priceBefore:938.6,priceAfter1D:932.4,priceAfter5D:918.2 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2025-04-17",epsEstimate:5.67,epsActual:6.61,priceBefore:992.1,priceAfter1D:1042.8,priceAfter5D:1068.3 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2025-01-21",epsEstimate:4.18,epsActual:4.27,priceBefore:858.1,priceAfter1D:982.4,priceAfter5D:998.6 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2024-10-17",epsEstimate:5.12,epsActual:5.4,priceBefore:694.3,priceAfter1D:763.39,priceAfter5D:785.76 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2024-07-18",epsEstimate:4.74,epsActual:4.88,priceBefore:654.55,priceAfter1D:641.97,priceAfter5D:659.44 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2024-04-18",epsEstimate:4.52,epsActual:5.28,priceBefore:613.16,priceAfter1D:559.49,priceAfter5D:618.36 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2024-01-23",epsEstimate:2.22,epsActual:2.11,priceBefore:481.01,priceAfter1D:561.87,priceAfter5D:576.94 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2023-10-18",epsEstimate:3.49,epsActual:3.73,priceBefore:362.23,priceAfter1D:404.73,priceAfter5D:421.78 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2023-07-19",epsEstimate:2.84,epsActual:3.29,priceBefore:469.0,priceAfter1D:438.0,priceAfter5D:449.71 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2023-04-18",epsEstimate:2.86,epsActual:2.88,priceBefore:336.89,priceAfter1D:328.83,priceAfter5D:354.92 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2026-08-05",epsEstimate:1.85,epsActual:2.06,priceBefore:103.29,priceAfter1D:108.40,priceAfter5D:110.20 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2026-05-07",epsEstimate:1.5,epsActual:1.57,priceBefore:112.6,priceAfter1D:118.4,priceAfter5D:120.1 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2026-02-05",epsEstimate:1.58,epsActual:1.63,priceBefore:112.6,priceAfter1D:106.8,priceAfter5D:104.2 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2025-11-06",epsEstimate:1.02,epsActual:1.11,priceBefore:98.4,priceAfter1D:102.1,priceAfter5D:105.8 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2025-08-06",epsEstimate:1.18,epsActual:1.43,priceBefore:97.8,priceAfter1D:104.6,priceAfter5D:108.2 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2025-05-07",epsEstimate:1.2,epsActual:1.45,priceBefore:102.4,priceAfter1D:110.8,priceAfter5D:112.1 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2025-02-05",epsEstimate:1.44,epsActual:1.76,priceBefore:108.86,priceAfter1D:112.17,priceAfter5D:113.09 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2024-11-14",epsEstimate:1.09,epsActual:1.14,priceBefore:100.56,priceAfter1D:109.38,priceAfter5D:115.57 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2024-08-07",epsEstimate:1.18,epsActual:1.39,priceBefore:86.34,priceAfter1D:85.76,priceAfter5D:87.44 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2024-05-07",epsEstimate:1.1,epsActual:1.21,priceBefore:113.86,priceAfter1D:116.57,priceAfter5D:102.18 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2024-02-07",epsEstimate:0.99,epsActual:1.22,priceBefore:96.36,priceAfter1D:107.49,priceAfter5D:112.39 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2023-11-08",epsEstimate:0.7,epsActual:0.82,priceBefore:84.95,priceAfter1D:85.88,priceAfter5D:92.47 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2023-08-09",epsEstimate:0.95,epsActual:1.03,priceBefore:88.41,priceAfter1D:84.17,priceAfter5D:83.6 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2026-08-05",epsEstimate:6.58,epsActual:8.38,priceBefore:1180.50,priceAfter1D:1223.67,priceAfter5D:1215.30 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2026-04-30",epsEstimate:6.79,epsActual:8.55,priceBefore:872.60,priceAfter1D:838.10,priceAfter5D:810.40 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2026-02-06",epsEstimate:6.91,epsActual:7.54,priceBefore:782.3,priceAfter1D:752.1,priceAfter5D:745.8 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2025-10-29",epsEstimate:5.89,epsActual:7.02,priceBefore:832.4,priceAfter1D:795.2,priceAfter5D:780.6 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2025-08-07",epsEstimate:3.46,epsActual:3.92,priceBefore:862.1,priceAfter1D:918.4,priceAfter5D:942.3 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2025-04-30",epsEstimate:3.44,epsActual:3.34,priceBefore:872.6,priceAfter1D:838.1,priceAfter5D:810.4 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2025-02-06",epsEstimate:5.46,epsActual:5.32,priceBefore:808.2,priceAfter1D:768.4,priceAfter5D:752.8 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2024-10-30",epsEstimate:3.24,epsActual:3.06,priceBefore:846.81,priceAfter1D:788.24,priceAfter5D:786.77 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2024-08-08",epsEstimate:3.46,epsActual:3.92,priceBefore:836.04,priceAfter1D:938.37,priceAfter5D:955.69 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2024-04-30",epsEstimate:2.48,epsActual:2.58,priceBefore:738.63,priceAfter1D:794.43,priceAfter5D:785.01 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2024-02-06",epsEstimate:2.85,epsActual:2.49,priceBefore:688.12,priceAfter1D:649.82,priceAfter5D:726.53 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2023-11-02",epsEstimate:1.98,epsActual:0.28,priceBefore:580.63,priceAfter1D:550.33,priceAfter5D:569.42 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2023-08-08",epsEstimate:2.58,epsActual:2.11,priceBefore:459.82,priceAfter1D:456.34,priceAfter5D:547.02 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2026-08-04",epsEstimate:1.61,epsActual:1.66,priceBefore:460.50,priceAfter1D:472.57,priceAfter5D:468.30 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2026-04-29",epsEstimate:1.29,epsActual:1.37,priceBefore:96.10,priceAfter1D:98.20,priceAfter5D:102.40 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2026-02-04",epsEstimate:1.32,epsActual:1.53,priceBefore:128.6,priceAfter1D:122.4,priceAfter5D:119.2 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2025-10-28",epsEstimate:1.17,epsActual:1.2,priceBefore:152.4,priceAfter1D:148.6,priceAfter5D:142.1 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2025-07-29",epsEstimate:0.68,epsActual:0.69,priceBefore:148.2,priceAfter1D:138.4,priceAfter5D:132.6 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2025-04-29",epsEstimate:0.94,epsActual:0.96,priceBefore:96.1,priceAfter1D:98.2,priceAfter5D:102.4 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2025-02-04",epsEstimate:1.08,epsActual:1.09,priceBefore:118.4,priceAfter1D:108.2,priceAfter5D:104.8 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2024-10-29",epsEstimate:0.92,epsActual:1.03,priceBefore:164.44,priceAfter1D:155.21,priceAfter5D:143.5 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2024-07-30",epsEstimate:0.68,epsActual:0.69,priceBefore:144.55,priceAfter1D:131.65,priceAfter5D:141.82 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2024-04-30",epsEstimate:0.62,epsActual:0.62,priceBefore:157.39,priceAfter1D:161.12,priceAfter5D:151.93 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2024-01-30",epsEstimate:0.77,epsActual:0.77,priceBefore:184.15,priceAfter1D:181.1,priceAfter5D:174.25 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2023-10-31",epsEstimate:0.68,epsActual:0.7,priceBefore:102.64,priceAfter1D:107.24,priceAfter5D:119.11 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2023-08-01",epsEstimate:0.57,epsActual:0.58,priceBefore:113.06,priceAfter1D:106.14,priceAfter5D:105.25 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2023-05-02",epsEstimate:0.56,epsActual:0.6,priceBefore:89.37,priceAfter1D:81.63,priceAfter5D:95.37 },
];

const SECTOR_MAP = {
  Technology:"Technology","Information Technology":"Technology",
  Financials:"Financials","Financial Services":"Financials",
  "Health Care":"Healthcare",Healthcare:"Healthcare",
  "Consumer Cyclical":"Consumer Discretionary","Consumer Discretionary":"Consumer Discretionary",
  "Consumer Defensive":"Consumer Staples","Consumer Staples":"Consumer Staples",
  Energy:"Energy","Communication Services":"Communication Services",
  Industrials:"Industrials","Real Estate":"Real Estate",Utilities:"Utilities",
  "Basic Materials":"Materials",Materials:"Materials",
};

async function fetchEarningsForTicker(ticker, apiKey) {
  try {
    const [earningsRes, priceRes, profileRes] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/earnings-surprises/${ticker}?apikey=${apiKey}`),
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line&from=2019-01-01&apikey=${apiKey}`),
      fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${apiKey}`),
    ]);
    const [earnings, priceData, profileArr] = await Promise.all([earningsRes.json(), priceRes.json(), profileRes.json()]);
    if (!Array.isArray(earnings) || !priceData?.historical) return [];
    const profile = Array.isArray(profileArr) ? profileArr[0] : null;
    const name = profile?.companyName || ticker;
    const sector = SECTOR_MAP[profile?.sector || "Other"] || profile?.sector || "Other";
    const priceList = priceData.historical;
    const results = [];
    for (const e of earnings.slice(0, 28)) {
      if (!e.actualEarningResult || !e.estimatedEarning || !e.date) continue;
      let beforeIdx = -1;
      for (let i = 0; i < priceList.length; i++) { if (priceList[i].date <= e.date) { beforeIdx = i; break; } }
      if (beforeIdx < 0 || beforeIdx - 1 < 0) continue;
      results.push({
        ticker, name, sector, date: e.date,
        epsEstimate: e.estimatedEarning, epsActual: e.actualEarningResult,
        priceBefore: priceList[beforeIdx].close,
        priceAfter1D: beforeIdx - 1 >= 0 ? priceList[beforeIdx - 1].close : priceList[beforeIdx].close,
        priceAfter5D: beforeIdx - 5 >= 0 ? priceList[beforeIdx - 5].close : priceList[beforeIdx - 1 >= 0 ? beforeIdx - 1 : beforeIdx].close,
      });
    }
    return results;
  } catch (err) { console.error(`Error fetching ${ticker}:`, err); return []; }
}

function process(raw) {
  return raw.map(d => {
    const surprise = d.epsEstimate !== 0 ? ((d.epsActual - d.epsEstimate) / Math.abs(d.epsEstimate)) * 100 : 0;
    const move1D = d.priceBefore !== 0 ? ((d.priceAfter1D - d.priceBefore) / d.priceBefore) * 100 : 0;
    const move5D = d.priceBefore !== 0 ? ((d.priceAfter5D - d.priceBefore) / d.priceBefore) * 100 : 0;
    return { ...d, surprise, move1D, move5D };
  });
}

function getLatest(data) {
  const m = {};
  data.forEach(d => { if (!m[d.ticker] || d.date > m[d.ticker].date) m[d.ticker] = d; });
  return Object.values(m);
}

const SC = { Technology:"#4f46e5", Financials:"#059669", Healthcare:"#d97706", "Consumer Discretionary":"#dc2626", "Consumer Staples":"#7c3aed", Energy:"#ea580c", "Communication Services":"#0891b2", Industrials:"#0d9488", "Real Estate":"#7c3aed", Utilities:"#ca8a04", Materials:"#e11d48", Other:"#64748b" };

function Stat({ label, value, sub, color }) {
  return (
    <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 18px", flex:"1 1 140px", minWidth:140 }}>
      <div style={{ fontSize:10, color:"var(--dim)", fontFamily:"var(--mono)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:700, color:color||"var(--text)", fontFamily:"var(--display)", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"var(--dim)", marginTop:4, lineHeight:1.3 }}>{sub}</div>}
    </div>
  );
}

function Scatter({ data, moveType, onDotClick }) {
  const [hov, setHov] = useState(null);
  const W=680, H=380, p={t:28,r:28,b:48,l:56};
  const pw=W-p.l-p.r, ph=H-p.t-p.b;
  const xs=data.map(d=>d.surprise), ys=data.map(d=>moveType==="1D"?d.move1D:d.move5D);
  const xMin=Math.min(...xs,-5), xMax=Math.max(...xs,5), yMin=Math.min(...ys,-5), yMax=Math.max(...ys,5);
  const xR=xMax-xMin||10, yR=yMax-yMin||10;
  const tx=v=>p.l+((v-xMin)/xR)*pw, ty=v=>p.t+ph-((v-yMin)/yR)*ph;
  const xT=Array.from({length:7},(_,i)=>xMin+(xR/6)*i);
  const yT=Array.from({length:7},(_,i)=>yMin+(yR/6)*i);
  const n=data.length, sX=xs.reduce((a,b)=>a+b,0), sY=ys.reduce((a,b)=>a+b,0);
  const sXY=xs.reduce((a,x,i)=>a+x*ys[i],0), sX2=xs.reduce((a,x)=>a+x*x,0);
  const slope=n>1?(n*sXY-sX*sY)/(n*sX2-sX*sX):0;
  const intercept=n>0?(sY-slope*sX)/n:0;

  return (
    <div style={{position:"relative"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W,display:"block"}}>
        <rect x={p.l} y={p.t} width={pw} height={ph} fill="var(--plot)" rx="3"/>
        {xT.map((t,i)=><line key={`xg${i}`} x1={tx(t)} x2={tx(t)} y1={p.t} y2={p.t+ph} stroke="var(--grid)" strokeWidth=".5"/>)}
        {yT.map((t,i)=><line key={`yg${i}`} x1={p.l} x2={p.l+pw} y1={ty(t)} y2={ty(t)} stroke="var(--grid)" strokeWidth=".5"/>)}
        {xMin<0&&xMax>0&&<line x1={tx(0)} x2={tx(0)} y1={p.t} y2={p.t+ph} stroke="var(--zero)" strokeWidth="1" strokeDasharray="4,3"/>}
        {yMin<0&&yMax>0&&<line x1={p.l} x2={p.l+pw} y1={ty(0)} y2={ty(0)} stroke="var(--zero)" strokeWidth="1" strokeDasharray="4,3"/>}
        {n>2&&<line x1={tx(xMin)} y1={ty(slope*xMin+intercept)} x2={tx(xMax)} y2={ty(slope*xMax+intercept)} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6,4" opacity=".5"/>}
        <text x={p.l+6} y={p.t+14} fill="var(--grid-label)" fontSize="8" fontFamily="var(--mono)">MISS + UP</text>
        <text x={p.l+pw-6} y={p.t+14} fill="var(--grid-label)" fontSize="8" fontFamily="var(--mono)" textAnchor="end">BEAT + UP</text>
        <text x={p.l+6} y={p.t+ph-6} fill="var(--grid-label)" fontSize="8" fontFamily="var(--mono)">MISS + DOWN</text>
        <text x={p.l+pw-6} y={p.t+ph-6} fill="var(--grid-label)" fontSize="8" fontFamily="var(--mono)" textAnchor="end">BEAT + DOWN</text>
        {xT.map((t,i)=><text key={`xl${i}`} x={tx(t)} y={p.t+ph+16} fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="var(--mono)">{t.toFixed(1)}%</text>)}
        {yT.map((t,i)=><text key={`yl${i}`} x={p.l-6} y={ty(t)+3} fill="var(--dim)" fontSize="9" textAnchor="end" fontFamily="var(--mono)">{t.toFixed(1)}%</text>)}
        <text x={p.l+pw/2} y={H-2} fill="var(--dim)" fontSize="10" textAnchor="middle" fontFamily="var(--body)" fontWeight="500">EPS Surprise %</text>
        <text transform={`rotate(-90) translate(${-(p.t+ph/2)}, 12)`} fill="var(--dim)" fontSize="10" textAnchor="middle" fontFamily="var(--body)" fontWeight="500">Price Move ({moveType==="1D"?"1-Day":"5-Day"}) %</text>
        {data.map((d,i)=>{
          const cx=tx(d.surprise),cy=ty(moveType==="1D"?d.move1D:d.move5D),h=hov===i;
          return(
            <g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} onClick={()=>onDotClick?.(d.ticker)} style={{cursor:"pointer"}}>
              <circle cx={cx} cy={cy} r={h?7:5} fill={SC[d.sector]||"#888"} opacity={h?1:.75} stroke={h?"var(--card)":"none"} strokeWidth="2"/>
              {h&&<text x={cx} y={cy-12} fill="var(--text)" fontSize="11" textAnchor="middle" fontWeight="700" fontFamily="var(--mono)">{d.ticker}</text>}
            </g>
          );
        })}
      </svg>
      {hov!==null&&(()=>{const d=data[hov],mv=moveType==="1D"?d.move1D:d.move5D;return(
        <div style={{position:"absolute",bottom:10,right:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",fontSize:12,fontFamily:"var(--mono)",lineHeight:1.6,boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
          <div style={{fontWeight:700,fontSize:13,fontFamily:"var(--body)",color:"var(--text)"}}>{d.ticker} · {d.name}</div>
          <div style={{color:"var(--dim)"}}>Surprise: <span style={{color:d.surprise>=0?"var(--green)":"var(--red)"}}>{d.surprise>=0?"+":""}{d.surprise.toFixed(2)}%</span></div>
          <div style={{color:"var(--dim)"}}>{moveType} Move: <span style={{color:mv>=0?"var(--green)":"var(--red)"}}>{mv>=0?"+":""}{mv.toFixed(2)}%</span></div>
          <div style={{fontSize:10,color:"var(--accent)",marginTop:2}}>Click for history →</div>
        </div>
      );})()}
    </div>
  );
}

function Drilldown({ ticker, data, onBack }) {
  const hist=data.filter(d=>d.ticker===ticker).sort((a,b)=>a.date.localeCompare(b.date));
  if(!hist.length) return <div><button onClick={onBack} style={{background:"var(--card)",border:"1px solid var(--border)",color:"var(--accent)",padding:"8px 16px",borderRadius:8,fontSize:12,fontFamily:"var(--mono)",marginBottom:20}}>← Back</button><p style={{color:"var(--dim)"}}>No data for {ticker}</p></div>;
  const name=hist[0]?.name,sector=hist[0]?.sector||"";
  const beats=hist.filter(d=>d.surprise>0),misses=hist.filter(d=>d.surprise<0);
  const avgSurp=hist.reduce((a,d)=>a+d.surprise,0)/hist.length;
  const avg1D=hist.reduce((a,d)=>a+d.move1D,0)/hist.length;
  const beatRate=((beats.length/hist.length)*100).toFixed(0);
  const beatsUp=beats.filter(d=>d.move1D>0).length;
  const missesDown=misses.filter(d=>d.move1D<0).length;
  const consistency=hist.length>0?(((beatsUp+missesDown)/hist.length)*100).toFixed(0):"0";
  const avgBeatMv=beats.length?beats.reduce((a,d)=>a+d.move1D,0)/beats.length:0;
  const avgMissMv=misses.length?misses.reduce((a,d)=>a+d.move1D,0)/misses.length:0;

  const patterns=[];
  if(parseInt(beatRate)>=75) patterns.push({label:"Serial Beater",desc:`Beats estimates ${beatRate}% of the time`,color:"var(--green)"});
  if(parseInt(beatRate)<=25) patterns.push({label:"Chronic Misser",desc:`Misses estimates ${100-parseInt(beatRate)}% of the time`,color:"var(--red)"});
  if(parseInt(consistency)>=80) patterns.push({label:"Predictable Reactor",desc:`Moves in expected direction ${consistency}% of the time`,color:"var(--accent)"});
  if(parseInt(consistency)<=40) patterns.push({label:"Contrarian Reactor",desc:`Often moves opposite to what you'd expect`,color:"var(--orange)"});
  if(misses.length>=2&&Math.abs(avgMissMv)>Math.abs(avgBeatMv)*1.5) patterns.push({label:"Punished on Misses",desc:`Avg miss drop (${avgMissMv.toFixed(1)}%) far exceeds avg beat rally (+${avgBeatMv.toFixed(1)}%)`,color:"var(--red)"});
  if(beats.length>=2&&avgBeatMv>Math.abs(avgMissMv)*1.5) patterns.push({label:"Rewarded on Beats",desc:`Avg beat rally (+${avgBeatMv.toFixed(1)}%) far exceeds avg miss drop (${avgMissMv.toFixed(1)}%)`,color:"var(--green)"});

  const W=680,H=320,pad={t:28,r:28,b:48,l:56};
  const pw=W-pad.l-pad.r,ph=H-pad.t-pad.b;
  const xs=hist.map(d=>d.surprise),ys=hist.map(d=>d.move1D);
  const xMin=Math.min(...xs,-3),xMax=Math.max(...xs,3),yMin=Math.min(...ys,-3),yMax=Math.max(...ys,3);
  const xR=xMax-xMin||6,yR=yMax-yMin||6;
  const tx=v=>pad.l+((v-xMin)/xR)*pw,ty=v=>pad.t+ph-((v-yMin)/yR)*ph;

  const BW=680,BH=260,bp={t:20,r:20,b:60,l:50};
  const bpw=BW-bp.l-bp.r,bph=BH-bp.t-bp.b;
  const barW=Math.min(48,(bpw/hist.length)*.7),gap=bpw/hist.length;
  const allM=hist.map(d=>d.move1D);
  const bYmin=Math.min(...allM,-2),bYmax=Math.max(...allM,2),bYR=bYmax-bYmin||4;
  const bty=v=>bp.t+bph-((v-bYmin)/bYR)*bph;
  const [hovBar,setHovBar]=useState(null);
  const [hovDot,setHovDot]=useState(null);

  return(
    <div>
      <button onClick={onBack} style={{background:"var(--card)",border:"1px solid var(--border)",color:"var(--accent)",padding:"8px 16px",borderRadius:8,fontSize:12,fontFamily:"var(--mono)",marginBottom:20}}>← Back to Overview</button>
      <div style={{display:"flex",alignItems:"baseline",gap:12,flexWrap:"wrap",marginBottom:4}}>
        <h2 style={{fontFamily:"var(--display)",fontSize:26,fontWeight:800,margin:0,letterSpacing:"-.02em",color:"var(--text)"}}>{ticker}</h2>
        <span style={{fontSize:14,color:"var(--dim)"}}>{name}</span>
        <span style={{fontSize:11,color:SC[sector]||"var(--dim)",fontFamily:"var(--mono)",background:"var(--tag-bg)",padding:"2px 8px",borderRadius:4}}>{sector}</span>
      </div>
      <p style={{color:"var(--dim)",fontSize:13,marginBottom:20}}>{hist.length} quarters of earnings data — looking for reaction patterns.</p>

      {patterns.length>0&&(
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
          {patterns.map((pt,i)=>(
            <div key={i} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 16px",flex:"1 1 200px",borderLeft:`3px solid ${pt.color}`}}>
              <div style={{fontSize:13,fontWeight:700,color:pt.color,fontFamily:"var(--display)",marginBottom:3}}>{pt.label}</div>
              <div style={{fontSize:11,color:"var(--dim)",lineHeight:1.4}}>{pt.desc}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
        <Stat label="Beat Rate" value={`${beatRate}%`} sub={`${beats.length} beats / ${misses.length} misses`} color="var(--green)"/>
        <Stat label="Avg Surprise" value={`${avgSurp>=0?"+":""}${avgSurp.toFixed(1)}%`} color={avgSurp>=0?"var(--green)":"var(--red)"}/>
        <Stat label="Avg 1D Move" value={`${avg1D>=0?"+":""}${avg1D.toFixed(1)}%`} color={avg1D>=0?"var(--green)":"var(--red)"}/>
        <Stat label="Consistency" value={`${consistency}%`} sub="Moves in expected direction" color="var(--accent)"/>
      </div>

      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:"16px 12px",marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:10,color:"var(--text)"}}>Surprise vs 1D Reaction — Each Quarter</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W,display:"block"}}>
          <rect x={pad.l} y={pad.t} width={pw} height={ph} fill="var(--plot)" rx="3"/>
          {xMin<0&&xMax>0&&<line x1={tx(0)} x2={tx(0)} y1={pad.t} y2={pad.t+ph} stroke="var(--zero)" strokeWidth="1" strokeDasharray="4,3"/>}
          {yMin<0&&yMax>0&&<line x1={pad.l} x2={pad.l+pw} y1={ty(0)} y2={ty(0)} stroke="var(--zero)" strokeWidth="1" strokeDasharray="4,3"/>}
          {Array.from({length:5},(_,i)=>xMin+(xR/4)*i).map((t,i)=><text key={i} x={tx(t)} y={pad.t+ph+16} fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="var(--mono)">{t.toFixed(1)}%</text>)}
          {Array.from({length:5},(_,i)=>yMin+(yR/4)*i).map((t,i)=><text key={i} x={pad.l-6} y={ty(t)+3} fill="var(--dim)" fontSize="9" textAnchor="end" fontFamily="var(--mono)">{t.toFixed(1)}%</text>)}
          <text x={pad.l+pw/2} y={H-2} fill="var(--dim)" fontSize="10" textAnchor="middle" fontFamily="var(--body)" fontWeight="500">EPS Surprise %</text>
          <text transform={`rotate(-90) translate(${-(pad.t+ph/2)}, 12)`} fill="var(--dim)" fontSize="10" textAnchor="middle" fontFamily="var(--body)" fontWeight="500">1-Day Move %</text>
          {hist.map((d,i)=>{
            const cx=tx(d.surprise),cy=ty(d.move1D),h=hovDot===i;
            return(
              <g key={i} onMouseEnter={()=>setHovDot(i)} onMouseLeave={()=>setHovDot(null)}>
                <circle cx={cx} cy={cy} r={h?8:6} fill={SC[sector]||"#888"} opacity={h?1:.7} stroke={h?"var(--card)":"none"} strokeWidth="2" style={{cursor:"pointer"}}/>
                {h&&<><text x={cx} y={cy-14} fill="var(--text)" fontSize="10" textAnchor="middle" fontWeight="600" fontFamily="var(--mono)">{d.date.slice(0,7)}</text>
                <text x={cx} y={cy-3} fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="var(--mono)">{d.surprise>=0?"+":""}{d.surprise.toFixed(1)}% → {d.move1D>=0?"+":""}{d.move1D.toFixed(1)}%</text></>}
              </g>
            );
          })}
        </svg>
        <div style={{textAlign:"center",fontSize:9,color:"var(--dim)",fontFamily:"var(--mono)",marginTop:4}}>Each dot = one quarter · Hover for detail</div>
      </div>

      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:"16px 12px",marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:10,color:"var(--text)"}}>1-Day Price Reaction by Quarter</div>
        <svg viewBox={`0 0 ${BW} ${BH}`} style={{width:"100%",maxWidth:BW,display:"block"}}>
          <line x1={bp.l} x2={bp.l+bpw} y1={bty(0)} y2={bty(0)} stroke="var(--zero)" strokeWidth="1"/>
          {[-10,-8,-6,-4,-2,0,2,4,6,8,10,12,14,16].filter(v=>v>=bYmin&&v<=bYmax).map((v,i)=>(
            <g key={i}><line x1={bp.l} x2={bp.l+bpw} y1={bty(v)} y2={bty(v)} stroke="var(--grid)" strokeWidth=".5"/>
            <text x={bp.l-6} y={bty(v)+3} fill="var(--dim)" fontSize="9" textAnchor="end" fontFamily="var(--mono)">{v}%</text></g>
          ))}
          {hist.map((d,i)=>{
            const x=bp.l+gap*i+(gap-barW)/2;
            const pos=d.move1D>=0;
            const bH=Math.abs(d.move1D/bYR)*bph;
            const y=pos?bty(0)-bH:bty(0);
            const h=hovBar===i;
            return(
              <g key={i} onMouseEnter={()=>setHovBar(i)} onMouseLeave={()=>setHovBar(null)}>
                <rect x={x} y={y} width={barW} height={Math.max(bH,1)} rx={3} fill={pos?"var(--green)":"var(--red)"} opacity={h?1:.7}/>
                <circle cx={x+barW/2} cy={bty(d.surprise)} r={4} fill="var(--accent)" stroke="var(--card)" strokeWidth="1.5"/>
                <text x={x+barW/2} y={BH-bp.b+16} fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="var(--mono)" transform={`rotate(-35 ${x+barW/2} ${BH-bp.b+16})`}>{d.date.slice(0,7)}</text>
                {h&&<text x={x+barW/2} y={y-6} fill="var(--text)" fontSize="10" textAnchor="middle" fontWeight="600" fontFamily="var(--mono)">{d.move1D>=0?"+":""}{d.move1D.toFixed(1)}%</text>}
              </g>
            );
          })}
        </svg>
        <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:6,fontSize:10,color:"var(--dim)",fontFamily:"var(--mono)"}}>
          <span><span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:"var(--green)",marginRight:4,verticalAlign:"middle"}}/>1D Price Move</span>
          <span><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"var(--accent)",marginRight:4,verticalAlign:"middle"}}/>EPS Surprise %</span>
        </div>
      </div>

      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
              {["Date","EPS Est","EPS Actual","Surprise","1D Move","5D Move"].map(h=>(<th key={h} style={{padding:"10px 14px",textAlign:"left",fontFamily:"var(--mono)",fontSize:9,textTransform:"uppercase",letterSpacing:".06em",color:"var(--dim)",fontWeight:600}}>{h}</th>))}
            </tr></thead>
            <tbody>
              {[...hist].reverse().map((d,i)=>(
                <tr key={i} style={{borderBottom:"1px solid var(--border)"}}>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",color:"var(--dim)"}}>{d.date}</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",color:"var(--text)"}}>${d.epsEstimate.toFixed(2)}</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",fontWeight:600,color:"var(--text)"}}>${d.epsActual.toFixed(2)}</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",fontWeight:600,color:d.surprise>=0?"var(--green)":"var(--red)"}}>{d.surprise>=0?"+":""}{d.surprise.toFixed(2)}%</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",fontWeight:600,color:d.move1D>=0?"var(--green)":"var(--red)"}}>{d.move1D>=0?"+":""}{d.move1D.toFixed(2)}%</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",fontWeight:600,color:d.move5D>=0?"var(--green)":"var(--red)"}}>{d.move5D>=0?"+":""}{d.move5D.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sector,setSector]=useState("All");
  const [moveType,setMoveType]=useState("1D");
  const [selectedTicker,setSelectedTicker]=useState(null);
  const [sortKey,setSortKey]=useState("surprise");
  const [sortDir,setSortDir]=useState(-1);
  const [apiKey,setApiKey]=useState("");
  const [showModal,setShowModal]=useState(false);
  const [liveData,setLiveData]=useState(null);
  const [loading,setLoading]=useState(false);
  const [loadProgress,setLoadProgress]=useState("");
  const [customTicker,setCustomTicker]=useState("");

  const fetchAllData = useCallback(async (key, tickers) => {
    setLoading(true);
    const allResults = [];
    for (let i = 0; i < tickers.length; i++) {
      setLoadProgress(`Loading ${tickers[i]} (${i+1}/${tickers.length})...`);
      const results = await fetchEarningsForTicker(tickers[i], key);
      allResults.push(...results);
      if (i < tickers.length - 1) await new Promise(r => setTimeout(r, 250));
    }
    setLiveData(allResults);
    setLoading(false);
    setLoadProgress("");
  }, []);

  const handleSaveKey = () => { setShowModal(false); if (apiKey.trim()) fetchAllData(apiKey.trim(), DEFAULT_TICKERS); };

  const handleAddTicker = () => {
    const t = customTicker.trim().toUpperCase();
    if (!t || !apiKey) return;
    setCustomTicker("");
    setLoading(true);
    setLoadProgress(`Loading ${t}...`);
    fetchEarningsForTicker(t, apiKey).then(results => {
      if (results.length) setLiveData(prev => [...(prev || []), ...results]);
      else { setLoadProgress(`No data found for ${t}`); setTimeout(() => setLoadProgress(""), 2000); }
      setLoading(false);
    });
  };

  const rawData = liveData || SAMPLE_DATA;
  const allData = useMemo(() => process(rawData), [rawData]);
  const sectors = useMemo(() => { const s = new Set(allData.map(d => d.sector)); return ["All", ...Array.from(s).sort()]; }, [allData]);
  const latest = useMemo(() => getLatest(allData), [allData]);
  const filtered = useMemo(() => sector === "All" ? latest : latest.filter(d => d.sector === sector), [latest, sector]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const av = sortKey === "move" ? (moveType === "1D" ? a.move1D : a.move5D) : a[sortKey];
    const bv = sortKey === "move" ? (moveType === "1D" ? b.move1D : b.move5D) : b[sortKey];
    return typeof av === "string" ? sortDir * av.localeCompare(bv) : sortDir * (av - bv);
  }), [filtered, sortKey, sortDir, moveType]);

  const stats = useMemo(() => {
    const beats = filtered.filter(d => d.surprise > 0), misses = filtered.filter(d => d.surprise < 0);
    const avgB = beats.length ? beats.reduce((a, d) => a + d.move1D, 0) / beats.length : 0;
    const avgM = misses.length ? misses.reduce((a, d) => a + d.move1D, 0) / misses.length : 0;
    const biggest = [...filtered].sort((a, b) => Math.abs(b.move1D) - Math.abs(a.move1D))[0];
    const over = filtered.filter(d => Math.abs(d.move1D) > Math.abs(d.surprise) * 2 && Math.abs(d.surprise) > 1);
    return { beats: beats.length, misses: misses.length, avgB, avgM, biggest, over };
  }, [filtered]);

  const toggleSort = k => { if (sortKey === k) setSortDir(d => d * -1); else { setSortKey(k); setSortDir(-1); } };
  const tickers = useMemo(() => [...new Set(allData.map(d => d.ticker))].sort(), [allData]);

  return (
    <div style={{ fontFamily:"var(--body)", color:"var(--text)", minHeight:"100vh", background:"var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        :root {
          --display:'Plus Jakarta Sans',sans-serif;
          --body:'Inter',sans-serif;
          --mono:'JetBrains Mono',monospace;
          --bg:#f8fafc;
          --card:#ffffff;
          --plot:#f1f5f9;
          --border:#e2e8f0;
          --text:#0f172a;
          --dim:#64748b;
          --grid-label:rgba(100,116,139,.3);
          --green:#059669;
          --red:#dc2626;
          --orange:#d97706;
          --accent:#4f46e5;
          --grid:rgba(100,116,139,.15);
          --zero:rgba(100,116,139,.3);
          --tag-bg:#f1f5f9;
          --btn-bg:#f1f5f9;
          --btn-active:#4f46e5;
        }
        *{box-sizing:border-box;margin:0}
        button{cursor:pointer;border:none;font-family:var(--body)}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
      `}</style>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 20px 60px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:4 }}>
          <h1 onClick={()=>setSelectedTicker(null)} style={{ fontFamily:"var(--display)", fontSize:26, fontWeight:800, letterSpacing:"-.02em", margin:0, cursor:"pointer", color:"var(--text)" }}>Earnings Surprise Tracker</h1>
          <button onClick={()=>setShowModal(true)} style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--accent)", padding:"7px 14px", borderRadius:8, fontSize:11, fontFamily:"var(--mono)", fontWeight:500 }}>
            {apiKey ? "API Key Set ✓" : "Connect API Key"}
          </button>
        </div>
        <p style={{ color:"var(--dim)", fontSize:13, marginBottom:6 }}>How stocks react to earnings surprises — click any stock for its historical pattern.</p>

        {loading && (
          <div style={{ padding:"10px 14px", background:"rgba(79,70,229,.06)", border:"1px solid rgba(79,70,229,.15)", borderRadius:8, fontSize:12, color:"var(--accent)", marginBottom:12, animation:"pulse 1.5s ease-in-out infinite" }}>
            {loadProgress || "Loading..."}
          </div>
        )}

        {!apiKey && !loading && (
          <div style={{ marginBottom:16, padding:"8px 12px", background:"rgba(79,70,229,.05)", border:"1px solid rgba(79,70,229,.12)", borderRadius:8, fontSize:11, color:"var(--accent)" }}>
            Sample data · Click "Connect API Key" for live earnings data from Financial Modeling Prep.
          </div>
        )}

        {apiKey && !selectedTicker && (
          <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center" }}>
            <input type="text" placeholder="Add ticker (e.g. INTC)" value={customTicker}
              onChange={e=>setCustomTicker(e.target.value.toUpperCase())}
              onKeyDown={e=>e.key==="Enter"&&handleAddTicker()}
              style={{ padding:"7px 12px", background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, color:"var(--text)", fontSize:12, fontFamily:"var(--mono)", width:160, outline:"none" }}
            />
            <button onClick={handleAddTicker} style={{ padding:"7px 14px", borderRadius:8, background:"var(--accent)", color:"#fff", fontSize:12, fontWeight:600 }}>Add</button>
          </div>
        )}

        {selectedTicker ? (
          <Drilldown ticker={selectedTicker} data={allData} onBack={()=>setSelectedTicker(null)} />
        ) : (
          <>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
              <Stat label="Beats" value={stats.beats} sub={`Avg 1D: ${stats.avgB>=0?"+":""}${stats.avgB.toFixed(1)}%`} color="var(--green)"/>
              <Stat label="Misses" value={stats.misses} sub={`Avg 1D: ${stats.avgM>=0?"+":""}${stats.avgM.toFixed(1)}%`} color="var(--red)"/>
              <Stat label="Biggest Reaction" value={stats.biggest?.ticker||"—"} sub={stats.biggest?`${stats.biggest.move1D>=0?"+":""}${stats.biggest.move1D.toFixed(1)}%`:""} color="var(--accent)"/>
              <Stat label="Overreactors" value={stats.over.length} sub={stats.over.length?stats.over.map(d=>d.ticker).join(", "):"None"}/>
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
              <div style={{ display:"flex", gap:3, background:"var(--btn-bg)", borderRadius:8, padding:3 }}>
                {["1D","5D"].map(m=>(
                  <button key={m} onClick={()=>setMoveType(m)} style={{ padding:"5px 12px", borderRadius:6, fontSize:11, fontFamily:"var(--mono)", fontWeight:500, background:moveType===m?"var(--btn-active)":"transparent", color:moveType===m?"#fff":"var(--dim)" }}>{m}</button>
                ))}
              </div>
              <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                {sectors.map(s=>(
                  <button key={s} onClick={()=>setSector(s)} style={{ padding:"5px 10px", borderRadius:6, fontSize:10, fontWeight:500, background:sector===s?"var(--card)":"transparent", border:sector===s?"1px solid var(--border)":"1px solid transparent", color:sector===s?"var(--text)":"var(--dim)" }}>{s==="All"?"All":s}</button>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
              <span style={{ fontSize:10, color:"var(--dim)", fontFamily:"var(--mono)", lineHeight:"26px" }}>DRILL DOWN:</span>
              {tickers.map(t=>(
                <button key={t} onClick={()=>setSelectedTicker(t)} style={{ padding:"4px 10px", borderRadius:6, fontSize:11, fontFamily:"var(--mono)", fontWeight:600, background:"var(--card)", border:"1px solid var(--border)", color:SC[allData.find(d=>d.ticker===t)?.sector]||"var(--text)" }}>{t}</button>
              ))}
            </div>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:14 }}>
              {Object.entries(SC).filter(([n])=>allData.some(d=>d.sector===n)).map(([n,c])=>(
                <div key={n} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:c }}/>
                  <span style={{ fontSize:9, color:"var(--dim)", fontFamily:"var(--mono)" }}>{n}</span>
                </div>
              ))}
            </div>

            <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:"16px 12px", marginBottom:20, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
              <Scatter data={filtered} moveType={moveType} onDotClick={setSelectedTicker}/>
              <div style={{ textAlign:"center", marginTop:6, fontSize:9, color:"var(--dim)", fontFamily:"var(--mono)" }}>Dashed = regression · Click any dot for history</div>
            </div>

            <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid var(--border)", background:"var(--btn-bg)" }}>
                      {[{k:"ticker",l:"Ticker"},{k:"sector",l:"Sector"},{k:"date",l:"Date"},{k:"surprise",l:"Surprise %"},{k:"move",l:moveType==="1D"?"1D Move":"5D Move"}].map(({k,l})=>(
                        <th key={k} onClick={()=>toggleSort(k)} style={{ padding:"10px 14px", textAlign:"left", fontFamily:"var(--mono)", fontSize:9, textTransform:"uppercase", letterSpacing:".06em", color:"var(--dim)", cursor:"pointer", userSelect:"none", fontWeight:600, whiteSpace:"nowrap" }}>{l} {sortKey===k?(sortDir>0?"↑":"↓"):""}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((d,i)=>{
                      const mv=moveType==="1D"?d.move1D:d.move5D;
                      const over=Math.abs(mv)>Math.abs(d.surprise)*2&&Math.abs(d.surprise)>1;
                      return(
                        <tr key={i} onClick={()=>setSelectedTicker(d.ticker)} style={{ borderBottom:"1px solid var(--border)", cursor:"pointer", background:over?"rgba(79,70,229,.03)":"transparent" }}>
                          <td style={{ padding:"9px 14px", fontFamily:"var(--mono)", fontWeight:600 }}>
                            <span style={{ color:SC[d.sector]||"var(--text)" }}>{d.ticker}</span>
                            <span style={{ color:"var(--dim)", fontWeight:400, fontSize:10, marginLeft:6 }}>{d.name}</span>
                          </td>
                          <td style={{ padding:"9px 14px", color:"var(--dim)", fontSize:10 }}>{d.sector}</td>
                          <td style={{ padding:"9px 14px", fontFamily:"var(--mono)", color:"var(--dim)", fontSize:11 }}>{d.date}</td>
                          <td style={{ padding:"9px 14px", fontFamily:"var(--mono)", fontWeight:600, color:d.surprise>=0?"var(--green)":"var(--red)" }}>{d.surprise>=0?"+":""}{d.surprise.toFixed(2)}%</td>
                          <td style={{ padding:"9px 14px", fontFamily:"var(--mono)", fontWeight:600, color:mv>=0?"var(--green)":"var(--red)" }}>
                            {mv>=0?"+":""}{mv.toFixed(2)}%
                            {over&&<span style={{ marginLeft:5, fontSize:8, color:"var(--accent)", fontWeight:500 }}>OVERREACTION</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.3)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20 }} onClick={()=>setShowModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:24, maxWidth:420, width:"100%", boxShadow:"0 8px 30px rgba(0,0,0,.12)" }}>
            <h3 style={{ fontFamily:"var(--display)", fontSize:16, fontWeight:700, marginBottom:6, color:"var(--text)" }}>Connect Live Data</h3>
            <p style={{ color:"var(--dim)", fontSize:12, lineHeight:1.5, marginBottom:6 }}>Get a free API key from Financial Modeling Prep:</p>
            <ol style={{ color:"var(--dim)", fontSize:12, lineHeight:1.8, marginBottom:14, paddingLeft:20 }}>
              <li>Go to <span style={{ color:"var(--accent)", fontWeight:500 }}>financialmodelingprep.com</span></li>
              <li>Sign up (free tier = 250 calls/day)</li>
              <li>Copy your API key from the dashboard</li>
              <li>Paste it below and hit Save</li>
            </ol>
            <input type="text" placeholder="Paste your FMP API key here" value={apiKey} onChange={e=>setApiKey(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSaveKey()}
              style={{ width:"100%", padding:"10px 12px", background:"var(--btn-bg)", border:"1px solid var(--border)", borderRadius:8, color:"var(--text)", fontSize:12, marginBottom:12, outline:"none", fontFamily:"var(--mono)" }}
            />
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={handleSaveKey} style={{ flex:1, padding:"10px", borderRadius:8, background:"var(--accent)", color:"#fff", fontWeight:600, fontSize:13 }}>Save & Load Data</button>
              <button onClick={()=>setShowModal(false)} style={{ flex:1, padding:"10px", borderRadius:8, background:"var(--btn-bg)", color:"var(--dim)", fontWeight:500, fontSize:13, border:"1px solid var(--border)" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
