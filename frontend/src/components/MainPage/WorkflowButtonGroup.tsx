import type { WorkflowButtonGroupProps } from "../../validation/actionButtonsSchema.ts";
import WorkflowButton from "./WorkflowButton.tsx";
import Box from "@mui/material/Box";

export default function WorkflowButtonGroup({
    onWorkflowClick,
    onBalanceClick,
    activeButton = null,
    disabledButtons = []
}: WorkflowButtonGroupProps) {
 return (
     <Box
         sx={{
             display: 'grid',
             gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
             gap: '12px',
             padding: '16px',
             backgroundColor: '#f7fafc',
             borderRadius: '12px',
             border: '1px solid #e2e8f0',
         }}
     >
         <WorkflowButton
             type="workflow"
             onClick={onWorkflowClick}
             isActive={activeButton === 'workflow'}
             disabled={disabledButtons.includes('workflow')}
         />

         <WorkflowButton
             type="balance"
             onClick={onBalanceClick}
             isActive={activeButton === 'balance'}
             disabled={disabledButtons.includes('balance')}
         />

     </Box>
 );
};
