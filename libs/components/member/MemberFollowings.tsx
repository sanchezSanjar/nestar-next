import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { FollowInquiry } from '../../types/follow/follow.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_MEMBER_FOLLOWERS, GET_MEMBER_FOLLOWINGS } from '../../../apollo/user/query';
import { Following } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';

interface MemberFollowingsProps {
	initialInput: FollowInquiry;
	subscribeHandler: any;
	unsubscribeHandler: any;
	redirectToMemberPageHandler: any;
	likeMemberHandler: any;
}

const MemberFollowings = (props: MemberFollowingsProps) => {
	const { initialInput, likeMemberHandler, subscribeHandler, unsubscribeHandler, redirectToMemberPageHandler } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation('common');
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const category: any = router.query?.category ?? 'properties';
	const [followInquiry, setFollowInquiry] = useState<FollowInquiry>(initialInput);
	const [memberFollowings, setMemberFollowings] = useState<Following[]>([]);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	
	const {
		loading: getMemberFollowingsLoading,
		data: getMemberFollowingsData,
		error: getMemberFollowingsError,
		refetch: getMemberFollowingsRefetch,
	} = useQuery(GET_MEMBER_FOLLOWINGS, {
		fetchPolicy: 'network-only',
		variables: { input: followInquiry },
		skip: !followInquiry?.search?.followerId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberFollowings(data?.getMemberFollowings?.list ?? []);
			setTotal(data?.getMemberFollowings?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		// on /mypage there is no memberId in the URL, so use the logged-in user once it's restored from the JWT
		const targetId = (router.query.memberId as string) ?? user?._id;
		if (targetId) setFollowInquiry({ ...followInquiry, page: 1, search: { followerId: targetId } });
	}, [router.query.memberId, user?._id]);
	// no manual refetch here: useQuery refetches by itself when followInquiry changes,
	// and refetch() ignores `skip`, so it sent requests with an empty id

	/** HANDLERS **/
	const paginationHandler = async (event: ChangeEvent<unknown>, value: number) => {
		setFollowInquiry({ ...followInquiry, page: value });
	};

	if (device === 'mobile') {
		return <div>NESTAR FOLLOWS MOBILE</div>;
	} else {
		return (
			<div id="member-follows-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">{category === 'followers' ? 'Followers' : 'Followings'}</Typography>
					</Stack>
				</Stack>
				<Stack className="follows-list-box">
					<Stack className="listing-title-box">
						<Typography className="title-text">{t('Name')}</Typography>
						<Typography className="title-text">{t('Details')}</Typography>
						<Typography className="title-text">{t('Subscription')}</Typography>
					</Stack>
					{memberFollowings?.length === 0 && (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>{t('No Followings yet!')}</p>
						</div>
					)}
					{memberFollowings.map((follower: Following) => {
						const imagePath: string = follower?.followingData?.memberImage
							? `${REACT_APP_API_URL}/${follower?.followingData?.memberImage}`
							: '/img/profile/defaultUser.svg';
						return (
							<Stack className="follows-card-box" key={follower._id}>
								<Stack className={'info'} onClick={() => redirectToMemberPageHandler(follower?.followingData?._id)}>
									<Stack className="image-box">
										<img src={imagePath} alt="" />
									</Stack>
									<Stack className="information-box">
										<Typography className="name">{follower?.followingData?.memberNick}</Typography>
									</Stack>
								</Stack>
								<Stack className={'details-box'}>
									<Box className={'info-box'} component={'div'}>
										<p>{t('Followers')}</p>
										<span>({follower?.followingData?.memberFollowers})</span>
									</Box>
									<Box className={'info-box'} component={'div'}>
										<p>{t('Followings')}</p>
										<span>({follower?.followingData?.memberFollowings})</span>
									</Box>
									<Box className={'info-box'} component={'div'}>
										{follower?.meLiked && follower?.meLiked[0]?.myFavorite ? (
											<FavoriteIcon color="primary" 
											onClick={() => 
												likeMemberHandler(follower?.followingData?._id, getMemberFollowingsRefetch, followInquiry)
											  }/>
										) : (
											<FavoriteBorderIcon 
											onClick={() => 
												likeMemberHandler(follower?.followingData?._id, getMemberFollowingsRefetch, followInquiry)
											  }/>
										)}
										<span>({follower?.followingData?.memberLikes})</span>
									</Box>
								</Stack>
								{user?._id !== follower?.followingId && (
									<Stack className="action-box">
										{follower.meFollowed && follower.meFollowed[0]?.myFollowing ? (
											<>
												<Typography>{t('Following')}</Typography>
												<Button
													variant="outlined"
													sx={{ background: '#f78181', ':hover': { background: '#f06363' } }}
													onClick={() => unsubscribeHandler(follower?.followingData?._id, getMemberFollowingsRefetch, followInquiry)}
												>
													{t('Unfollow')}
												</Button>
											</>
										) : (
											<Button
												variant="contained"
												sx={{ background: '#60eb60d4', ':hover': { background: '#60eb60d4' } }}
												onClick={() => subscribeHandler(follower?.followingData?._id, getMemberFollowingsRefetch, followInquiry)}
											>
												{t('Follow')}
											</Button>
										)}
									</Stack>
								)}
							</Stack>
						);
					})}
				</Stack>
				{memberFollowings.length !== 0 && (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								page={followInquiry.page}
								count={Math.ceil(total / followInquiry.limit)}
								onChange={paginationHandler}
								shape="circular"
								color="primary"
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>{t('{{count}} followings', { count: total })}</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
	}
};

MemberFollowings.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: {
			followerId: '',
		},
	},
};

export default MemberFollowings;
