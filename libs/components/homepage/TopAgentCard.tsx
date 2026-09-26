import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation('common');
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const pushAgentDetailHandler = () => {
		router.push({ pathname: '/agent/detail', query: { agentId: agent?._id } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card" onClick={pushAgentDetailHandler}>
				<img src={agentImage} alt="" />

				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType && t(agent.memberType)}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card" onClick={pushAgentDetailHandler} sx={{ cursor: 'pointer' }}>
				<img src={agentImage} alt="" />

				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType && t(agent.memberType)}</span>
			</Stack>
		);
	}
};

export default TopAgentCard;
