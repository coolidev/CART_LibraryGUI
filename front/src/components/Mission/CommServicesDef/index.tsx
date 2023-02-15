import { FC, useEffect, useState } from 'react';
import {
	Grid,
	Box,
	TextField,
	Typography,
	makeStyles,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Radio,
	FormControl,
	Select,
	MenuItem,
	Button,
	useTheme,
	Tooltip,
	IconButton,
} from '@material-ui/core';
import type { ChangeProps } from 'src/pages/home/QuickAccess';
import CustomNumberFormat from 'src/components/CustomNumberFormat';
import type { Theme } from 'src/theme';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { State } from 'src/pages/home';
import { THEMES } from 'src/utils/constants/general';
import CoverageMetricsDialog from './CoverageMetricsDialog';
import CommsPayloadSpecDialog from './CommsPayloadSpecsDialog';
import axios from 'src/utils/axios';
import { TooltipList } from 'src/utils/constants/tooltips';
import { ArrowDropDown, HighlightOff as ClearIcon } from '@material-ui/icons';

interface ConstraintsProps {
	state: State;
	bounds: { [key: string]: { min: number; max: number } };
	onChange: (values: ChangeProps) => void;
	accordion: any;
	setAccordion: (values: any) => void;
}

export interface AttrValue {
	id: number;
	name: string;
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		marginTop: theme.spacing(2)
	},
	box: {
		border: `1px solid ${theme.palette.border.main}`,
		borderRadius: 6
	},
	textfield: {
		[`& fieldset`]: {
			borderRadius: 6,
			border: '1px solid black'
		},
		'& .MuiOutlinedInput-root': {
			background: '#fff'
		}
	},
	input: {
		textAlign: 'center',
		borderRadius: 6,
		border: `1px solid ${theme.palette.border.main
			}`,
		backgroundColor: theme.palette.component.main
	},
	disabledInput: {
		textAlign: 'center',
		borderRadius: 6,
		border: `1px solid grey`,
		backgroundColor: theme.palette.component.main
	},
	interiorBox: {
		backgroundColor: theme.palette.component.main
	},
	select: {
		padding: 0,
		//boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0', --To be added back when we make shadows everywhere
		borderRadius: '4px',
		border: `solid 1px ${theme.palette.border.main}`,
		color: `${theme.palette.text.primary} !important`,
		'& .MuiSelect-iconOutlined': {
			color: theme.palette.border.main
		}
	},
	header: {
		fontWeight: 'bold'
	}
}));

const CommServicesDef: FC<ConstraintsProps> = ({ state, bounds, onChange, accordion, setAccordion }) => {
	const classes = useStyles();
	const theme = useTheme<Theme>();
	const [throughput, setThroughput] = useState<number>(state.specifications.throughput);
	const [coverageDialog, setCoverageDialog] = useState<boolean>(false);
	const [commsPayloadSpecDialog, setCommsPayloadSpecDialog] = useState<boolean>(false);
	const [stdComp, setStdComp] = useState<number>(0);
	const [freqBandOptions, setFreqBandOptions] = useState<AttrValue[]>([]);
	const [freqBandSelection, setFreqBandSelection] = useState<number>(state.constraints.freqBandFilter ?? -1);
	const [centerFreq, setCenterFreq] = useState<number>(state.constraints.centerFreqFilter);
	const [freqBandDetails, setFreqBandDetails] = useState<any[]>(null);

	const handleAccordion = (event) => {
		const { id } = event.currentTarget;
		const value = event.currentTarget.getAttribute('aria-expanded') === 'false';
		setAccordion((prevState) => ({ ...prevState, 'specification-panel': false, [id]: value }));
	};

	useEffect(() => {
		const fetchFrequencyBandData = async () => {
			const response = await axios.get<AttrValue[]>('/getAttributeValues', {
				params: { sub_key: 'frequency_bands ' }
			});
			response.data && setFreqBandOptions(response.data);
		};
		fetchFrequencyBandData();
	}, []);

	useEffect(() => {
		const fetchFrequencyBandSpecs = async () => {
			const response = await axios.get<AttrValue[]>('/getFrequencyBandSpecs', {});
			response.data && setFreqBandDetails(response.data);
		};
		fetchFrequencyBandSpecs();
	}, []);

	useEffect(() => {
		if (throughput !== state.specifications.throughput) {
			setThroughput(state.specifications.throughput);
		}
	}, [state.specifications.throughput]);

	useEffect(() => {
		if (freqBandSelection !== state.constraints.freqBandFilter) {
			setFreqBandSelection(state.constraints.freqBandFilter ?? -1);
		}

		if (!state.constraints.freqBandFilter || state.constraints.freqBandFilter === -1) {
			onChange({ name: 'centerFreqFilter', value: -1, category: 'constraints' });
			return;
		}

		try {
			if (freqBandDetails) {
				const currFreq = freqBandDetails.find(curr => curr.id === state.constraints.freqBandFilter);
				onChange({ name: 'centerFreqFilter', value: currFreq.minFrequency_MHz + ((currFreq.maxFrequency_MHz - currFreq.minFrequency_MHz) / 2), category: 'constraints' });
			}
		} catch { }
	}, [state.constraints.freqBandFilter]);

	useEffect(() => {
		if (centerFreq !== state.constraints.centerFreqFilter) {
			setCenterFreq(state.constraints.centerFreqFilter ?? -1);
		}
	}, [state.constraints.centerFreqFilter]);

	const handleClick = (event): void => {
		const { name, value } = event.target;
		if (name === 'throughput') {
			onChange({ name, value: parseFloat(value), category: 'specifications' });
		} else if (name === 'centerFreqFilter') {
			onChange({ name, value: parseFloat(value.replace(' ', '').length > 0 ? value.replace(',', '') : -1), category: 'constraints' });
		} else if (name === 'freqBandFilter') {
			onChange({ name, value: parseFloat(value), category: 'constraints' });
		}
	};

	return (
		<>
			<div className={classes.root}>
				<Box p={2} className={classes.box}>
					<Accordion key={'constraints'} className={classes.interiorBox} expanded={accordion[`constraints-panel`] ?? false}>
						<AccordionSummary id={`constraints-panel`} onClick={handleAccordion}>
							<Typography style={{ width: '100%', fontSize: '12pt' }}>
								{`Communications Services Definition`}
							</Typography>
							{!Object.keys(accordion).includes(`constraints-panel`) ||
								!accordion[`constraints-panel`] ? (
								<KeyboardArrowDownIcon fontSize="small" />
							) : (
								<KeyboardArrowUpIcon fontSize="small" />
							)}
						</AccordionSummary>
						<AccordionDetails>
							<Grid container justify="flex-start" alignItems="center" spacing={2}>
								<Grid item md={12}>
									<Tooltip title={TooltipList.serviceType}>
										<Typography variant="body1" component="p" color="textPrimary" className={classes.header}>
											{'Service Type'}
										</Typography>
									</Tooltip>
								</Grid>
								<Radio
									name={'upService'}
									checked={false}
									onChange={() => { }}
									disabled={true}
								/>
								<Typography variant="body1" component="p" color="textSecondary">
									Up/Forward
								</Typography>
								<Radio
									name={'downService'}
									checked={true}
									onChange={() => { }}
									disabled={false}
								/>
								<Typography variant="body1" component="p" color="textPrimary">
									Down/Return
								</Typography>
								<Grid item md={12}>
									<Tooltip title={TooltipList.serviceType}>
										<Typography variant="body1" component="p" color="textPrimary" className={classes.header}>
											{'Service Throughput Requirements'}
										</Typography>
									</Tooltip>
								</Grid>
								<Radio
									name={'dataVolume'}
									checked={false}
									onChange={() => { }}
									disabled={true}
								/>
								<Typography variant="body1" component="p" color="textSecondary">
									Data Volume
								</Typography>
								<Radio
									name={'dataRate'}
									checked={true}
									onChange={() => { }}
									disabled={false}
								/>
								<Typography variant="body1" component="p" color="textPrimary">
									Data Rate
								</Typography>
								<Grid item sm={12} />
								<Grid item md={5}>
									<Tooltip title={TooltipList.dataVolume}>
										<Typography variant="body1" component="p" color="textPrimary">
											{'Data Volume (MB)'}
										</Typography>
									</Tooltip>
								</Grid>
								<Grid item md={4}>
									<TextField
										name="dataVolume"
										value={''}
										disabled={true}
										onBlur={() => { }}
										InputProps={{
											inputComponent: CustomNumberFormat,
											disableUnderline: true,
											inputProps: {
												className: classes.disabledInput,
												min: 0,
												max: 0
											}
										}}
										onKeyPress={(ev) => {
											if (ev.key === 'Enter') {
												//handleClick(ev);
											}
										}}
										fullWidth
									/>
								</Grid>
								<Grid item md={3}>
									<FormControl variant="filled" size="small" fullWidth>
										<Select
											//className={classes.select}
											name="type"
											variant="outlined"
											data-filter-network="true"
											value={'Orbit'}
											defaultValue={'Orbit'}
											color="secondary"
											disabled={true}
											renderValue={() => 'Orbit'}

										>
											<MenuItem value={0}>Orbit</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item md={7}>
									<Tooltip title={TooltipList.data_Rate}>
										<Typography variant="body1" component="p" color="textPrimary">
											{'Data Rate (Gb/Day)'}
										</Typography>
									</Tooltip>
								</Grid>
								<Grid item md={5}>
									<TextField
										name="throughput"
										value={throughput}
										onBlur={handleClick}
										InputProps={{
											inputComponent: CustomNumberFormat,
											disableUnderline: true,
											inputProps: {
												className: classes.input,
												min: bounds.throughput.min,
												max: bounds.throughput.max
											}
										}}
										onKeyPress={(ev) => {
											if (ev.key === 'Enter') {
												handleClick(ev);
											}
										}}
										fullWidth
									/>
								</Grid>
								<Grid item sm={12} />
								<Grid container justify="center" alignItems="center" spacing={2}>
									<Grid item md={8}>
										<Button
											name="Coverage Metrics"
											variant={'contained'}
											color={'primary'}
											style={{
												color:
													theme.name === THEMES.LIGHT
														? '#fff'
														: theme.palette.text.primary
											}}
											className={classes.box}
											onClick={() => { setCoverageDialog(true); }}
											size="small"
											fullWidth
										>
											Coverage Metrics
										</Button>
									</Grid>
								</Grid>
								<Grid item lg={12} />
								<Grid item md={12}>
									<Typography variant="body1" component="p" color="textPrimary" className={classes.header}>
										Service Constraints
									</Typography>
								</Grid>
								<Grid item md={7}>
									<Tooltip title={TooltipList.frequencyBand}>
										<Typography variant="body1" component="p" color="textPrimary">
											{'Frequency Band'}
										</Typography>
									</Tooltip>
								</Grid>
								<Grid item md={5}>
									<FormControl variant="filled" size="small" fullWidth>
										<Select
											className={classes.select}
											name="freqBandFilter"
											variant="outlined"
											data-filter-network="true"
											value={freqBandSelection}
											color="primary"
											onChange={handleClick}
											style={{ textAlign: 'center' }}
											IconComponent={props => freqBandSelection === -1 ? (
												<ArrowDropDown {...props} className={`material-icons ${props.className}`} />
											) : <IconButton size='small' onClick={() => { setFreqBandSelection(-1) }}><ClearIcon /></IconButton>}
										>
											<MenuItem value={-1}>---</MenuItem>
											{freqBandOptions.map((option) => {
												return <MenuItem value={option.id}>{option.name}</MenuItem>
											})}
										</Select>
									</FormControl>
								</Grid>
								<Grid item md={7}>
									<Tooltip title={TooltipList.centerFrequency}>
										<Typography variant="body1" component="p" color="textPrimary">
											{'Center Frequency'}
										</Typography>
									</Tooltip>
								</Grid>
								<Grid item md={5}>
									<TextField
										name="centerFreqFilter"
										value={centerFreq === -1 ? '' : centerFreq}
										onBlur={handleClick}
										InputProps={{
											inputComponent: CustomNumberFormat,
											disableUnderline: true,
											inputProps: {
												className: classes.input,
												min: 0,
												max: 100000
											}
										}}
										onKeyPress={(ev) => {
											if (ev.key === 'Enter') {
												handleClick(ev);
											}
										}}
										fullWidth
									/>
								</Grid>
								<Grid item md={7}>
									<Tooltip title={TooltipList.standardsCompliance}>
										<Typography variant="body1" component="p" color="textPrimary">
											{'Standards Compliance'}
										</Typography>
									</Tooltip>
								</Grid>
								<Grid item md={5}>
									<FormControl variant="filled" size="small" fullWidth>
										<Select
											className={classes.select}
											name="type"
											variant="outlined"
											data-filter-network="true"
											value={stdComp}
											color="primary"
											onChange={(e) => { setStdComp(e.target.value as number) }}
											style={{ textAlign: 'center' }}
											IconComponent={props => stdComp === 0 ? (
												<ArrowDropDown {...props} className={`material-icons ${props.className}`} />
											) : <IconButton size='small' onClick={() => { setStdComp(0) }}><ClearIcon /></IconButton>}
										>
											<MenuItem value={0}>---</MenuItem>
											<MenuItem value={1}>CCSDS</MenuItem>
											<MenuItem value={2}>DVB-S2</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item sm={12} />
								<Grid container justify="center" alignItems="center" spacing={2}>
									<Grid item md={8}>
										<Button
											name="Comms Payload Specs"
											variant={'contained'}
											color={'primary'}
											style={{
												color:
													theme.name === THEMES.LIGHT
														? '#fff'
														: theme.palette.text.primary
											}}
											className={classes.box}
											onClick={() => { setCommsPayloadSpecDialog(true) }}
											size="small"
											fullWidth
										>
											Comms Payload Specifications
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</AccordionDetails>
					</Accordion>
				</Box>
			</div>
			<CoverageMetricsDialog
				state={state}
				bounds={bounds}
				onChange={onChange}
				coverageDialog={coverageDialog}
				setCoverageDialog={setCoverageDialog}
			/>
			<CommsPayloadSpecDialog
				state={state}
				bounds={bounds}
				onChange={onChange}
				commsPayloadSpecDialog={commsPayloadSpecDialog}
				setCommsPayloadSpecDialog={setCommsPayloadSpecDialog}
			/>
		</>
	);
};

export default CommServicesDef;
