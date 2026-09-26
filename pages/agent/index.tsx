import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AgentCard from '../../libs/components/common/AgentCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { GET_AGENTS } from '../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_MEMBER, LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const parseInput = (input: unknown) => {
	if (typeof input !== 'string') return null;
	try {
		return JSON.parse(input);
	} catch {
		return null;
	}
};

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(parseInput(router?.query?.input) ?? initialInput);
	const [agents, setAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const { loading: getAgentsLoading, data: getAgentsData, error: getAgentsError, refetch: getAgentsRefetch } = useQuery(GET_AGENTS, {
		fetchPolicy: "network-only",
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgents(data?.getAgents?.list);
			setTotal(data?.getAgents?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const input_obj = parseInput(router.query.input);
		if (input_obj) {
			setSearchFilter(input_obj);
			setCurrentPage(input_obj.page ?? 1);
		} else {
			router.replace(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`);
			setCurrentPage(searchFilter.page ?? 1);
		}
	}, [router]);

	/** HANDLERS **/
	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			//likeTargetMember()
			await likeTargetMember({ variables: { input: id } });
			//getAgentsRefetch
			await getAgentsRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert("success", 800);
		} catch (err: any) {
			console.log("ERROR, likePropertyHandler", err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	}

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	// const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
	// 	switch (e.currentTarget.id) {
	// 		case 'recent':
	// 			setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
	// 			setFilterSortName('Recent');
	// 			break;
	// 		case 'old':
	// 			setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
	// 			setFilterSortName('Oldest order');
	// 			break;
	// 		case 'likes':
	// 			setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
	// 			setFilterSortName('Likes');
	// 			break;
	// 		case 'views':
	// 			setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
	// 			setFilterSortName('Views');
	// 			break;
	// 	}
	// 	setSortingOpen(false);
	// 	setAnchorEl2(null);
	// };

	const sortingHandler = useCallback(
		async (e: React.MouseEvent<HTMLLIElement>) => {
			let updatedFilter;

			switch (e.currentTarget.id) {
				case 'recent':
					updatedFilter = { ...searchFilter, sort: 'createdAt', direction: 'DESC' };
					setFilterSortName('Recent');
					break;
				case 'old':
					updatedFilter = { ...searchFilter, sort: 'createdAt', direction: 'ASC' };
					setFilterSortName('Oldest');
					break;
				case 'likes':
					updatedFilter = { ...searchFilter, sort: 'memberLikes', direction: 'DESC' };
					setFilterSortName('Likes');
					break;
				case 'views':
					updatedFilter = { ...searchFilter, sort: 'memberViews', direction: 'DESC' };
					setFilterSortName('Views');
					break;
			}

			await router.push(
				`/agent?input=${JSON.stringify(updatedFilter)}`,
				`/agent?input=${JSON.stringify(updatedFilter)}`,
				{ scroll: false }
			);

			setSortingOpen(false);
			setAnchorEl2(null);
		},
		[searchFilter, router]
	);
	
	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		const updatedFilter = { ...searchFilter, page: value };
		await router.push(`/agent?input=${JSON.stringify(updatedFilter)}`, `/agent?input=${JSON.stringify(updatedFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	if (device === 'mobile') {
		return <h1>AGENTS PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'agent-list-page'}>
				<Stack className={'container'}>
					<Stack className={'filter'}>
						<Box component={'div'} className={'left'}>
							<input
								type="text"
								placeholder={t('Search for an agent')}
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key == 'Enter') {
										const updatedFilter = {
											...searchFilter,
											page: 1,
											search: { ...searchFilter.search, text: searchText },
										};
										router.push(
											`/agent?input=${JSON.stringify(updatedFilter)}`,
											`/agent?input=${JSON.stringify(updatedFilter)}`,
											{ scroll: false },
										);
									}
								}}
							/>
						</Box>
						<Box component={'div'} className={'right'}>
							<span>{t('Sort by')}</span>
							<div>
								<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
									{t(filterSortName)}
								</Button>
								<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
									<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
										{t('Recent')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
										{t('Oldest')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
										{t('Likes')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
										{t('Views')}
									</MenuItem>
								</Menu>
							</div>
						</Box>
					</Stack>
					<Stack className={'card-wrap'}>
						{agents?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>{t('No Agents found!')}</p>
							</div>
						) : (
							agents.map((agent: Member) => {
								return <AgentCard agent={agent} key={agent._id} likeMemberHandler={likeMemberHandler} />;
							})
						)}
					</Stack>
					<Stack className={'pagination'}>
						<Stack className="pagination-box">
							{agents.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={paginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
						</Stack>

						{agents.length !== 0 && (
							<span>
								{t('Total {{count}} agents available', { count: total })}
							</span>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

AgentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgentList);
