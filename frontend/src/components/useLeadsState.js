// src/hooks/useLeadStats.js
import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * useLeadStats
 * Encapsulates all of the data-fetching and counting logic
 * that was previously in ProgressItem.jsx.
 */
export default function useLeadStats() {
  const [opportunityCount, setOpportunityCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [opportunityPercentage, setOpportunityPercentage] = useState(0);
  const [leadsPercentage, setLeadsPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/api/leads');
        if (response.data.success) {
          const allLeads = response.data.data;
          // opportunities = leads with every phase completed
          const opportunities = allLeads.filter(lead =>
            lead.phases.every(phase => phase.status === 'Completed')
          );
          // active leads = not fully completed
          const activeLeads = allLeads.filter(lead =>
            !lead.phases.every(phase => phase.status === 'Completed')
          );
          const opportunityCount = opportunities.length;
          const leadsCount = activeLeads.length;
          const total = opportunityCount + leadsCount;
          const oppPct = total > 0
            ? Math.round((opportunityCount / total) * 100)
            : 0;

          setOpportunityCount(opportunityCount);
          setLeadsCount(leadsCount);
          setOpportunityPercentage(oppPct);
          setLeadsPercentage(100 - oppPct);
        }
      } catch (err) {
        console.error('Error fetching lead stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    opportunityCount,
    leadsCount,
    opportunityPercentage,
    leadsPercentage,
    isLoading,
  };
}
