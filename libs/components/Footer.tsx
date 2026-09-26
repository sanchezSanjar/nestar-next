import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { useTranslation } from 'next-i18next';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('total free customer care')}</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('nee live')}</span>
							<p>+82 10 4867 2909</p>
							<span>{t('Support?')}</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>{t('follow us on social media')}</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>{t('Popular Search')}</strong>
								<span>{t('Property for Rent')}</span>
								<span>{t('Property Low to hide')}</span>
							</div>
							<div>
								<strong>{t('Quick Links')}</strong>
								<span>{t('Terms of Use')}</span>
								<span>{t('Privacy Policy')}</span>
								<span>{t('Pricing Plans')}</span>
								<span>{t('Our Services')}</span>
								<span>{t('Contact Support')}</span>
								<span>{t('FAQs')}</span>
							</div>
							<div>
								<strong>{t('Discover')}</strong>
								<span>{t('Seoul')}</span>
								<span>{t('Gyeongido')}</span>
								<span>{t('Busan')}</span>
								<span>{t('Jejudo')}</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>{t('© Nestar - All rights reserved. Nestar {{year}}', { year: moment().year() })}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('total free customer care')}</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>{t('nee live')}</span>
							<p>+82 10 4867 2909</p>
							<span>{t('Support?')}</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>{t('follow us on social media')}</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>{t('keep yourself up to date')}</strong>
							<div>
								<input type="text" placeholder={t('Your Email')} />
								<span>{t('Subscribe')}</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>{t('Popular Search')}</strong>
								<span>{t('Property for Rent')}</span>
								<span>{t('Property Low to hide')}</span>
							</div>
							<div>
								<strong>{t('Quick Links')}</strong>
								<span>{t('Terms of Use')}</span>
								<span>{t('Privacy Policy')}</span>
								<span>{t('Pricing Plans')}</span>
								<span>{t('Our Services')}</span>
								<span>{t('Contact Support')}</span>
								<span>{t('FAQs')}</span>
							</div>
							<div>
								<strong>{t('Discover')}</strong>
								<span>{t('Seoul')}</span>
								<span>{t('Gyeongido')}</span>
								<span>{t('Busan')}</span>
								<span>{t('Jejudo')}</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>{t('© Nestar - All rights reserved. Nestar {{year}}', { year: moment().year() })}</span>
					<span>{t('Privacy · Terms · Sitemap')}</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
