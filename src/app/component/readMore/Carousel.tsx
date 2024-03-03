"use client"

import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { autoPlay } from 'react-swipeable-views-utils';
import CircularProgress from "@mui/material/CircularProgress";
import SwipeableViews from "react-swipeable-views";
import Image from 'next/image';
import styles from "./incidents.module.css";


const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


export function Carousel({ }) {

    const IncidentsNewsArr = [
        {
            title: 'Фура въехала в группу юных велосипедистов под Выборгом: двое детей пострадали',
            img: '/images/incidents/1.png',
            createdAt: '1.01.2023, 13:53',
            newsType: 'Политика',
            like: 23,
            angry: 23,
            dislike: 23,
            comment: 7,
            favoriteAdd: 14

        },
        {
            title: 'Семилетняя девочка их Екатеринбурга умерла после купания в Черном море',
            img: '/images/incidents/2.png',
            createdAt: '1.01.2023, 13:53',
            newsType: 'Политика',
            like: 23,
            angry: 23,
            dislike: 23,
            comment: 7,
            favoriteAdd: 14

        },
        {
            title: 'Теннис-спорт леди и джентельменов. Как разобраться в нем?',
            img: '/images/incidents/3.png',
            createdAt: '1.01.2023, 13:53',
            newsType: 'Политика',
            like: 23,
            angry: 23,
            dislike: 23,
            comment: 7,
            favoriteAdd: 14
        },
        {
            title: 'Как скейтбординг стал популярным видом спорта и модной субкультурой?',
            img: '/images/incidents/4.png',
            createdAt: '14:59',
            newsType: 'Политика',
            like: 23,
            angry: 23,
            dislike: 23,
            comment: 7,
            favoriteAdd: 14
        }
    ]

    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = IncidentsNewsArr.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <>
            <div className={styles.coruselBg}>
                {IncidentsNewsArr.length > 0 ?
                    <Box sx={{
                        width: '100%', flexGrow: 1, display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <AutoPlaySwipeableViews

                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={activeStep}
                            onChangeIndex={handleStepChange}
                            enableMouseEvents
                        >
                            {IncidentsNewsArr.map((item, index) => (

                                <div className={styles.card} key={index}>
                                    <div className={styles.img}>
                                        <Image
                                            src={item.img}
                                            width="0"
                                            height="0"
                                            sizes="100vh"
                                            alt={item.title}
                                            className="w-full h-auto radius-12 rounded"
                                        />
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.cardHeader}>
                                            <p className={styles.newsDate}>{item.createdAt}</p>
                                        </div>
                                        <div className={styles.cardTitle}>
                                            {item.title}
                                        </div>


                                        <div className={styles.reaction}>
                                            <div className={styles.emotion}> <div />
                                                😍{item.like}
                                            </div>
                                            <div className={styles.emotion}> <div />
                                                😡{item.angry}
                                            </div>
                                            <div className={styles.emotion}> <div />
                                                💩{item.dislike}
                                            </div>
                                            <div className={styles.interactions}> <div />
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.00016 13.4004C11.3145 13.4004 14 11.1618 14 8.40039C14 5.63903 11.3145 3.40039 8.00016 3.40039C4.68582 3.40039 2.00032 5.63903 2.00032 8.40039C2.00032 9.49698 2.42434 10.5112 3.14259 11.3379C3.04163 11.6049 2.89164 11.8407 2.73299 12.0396C2.59453 12.2157 2.45319 12.3521 2.34934 12.4458C2.29742 12.4913 2.25416 12.5282 2.22531 12.551C2.21089 12.5623 2.19935 12.5708 2.19358 12.5737L2.18781 12.5794C2.02916 12.6958 1.95993 12.9004 2.02339 13.085C2.08685 13.2697 2.26281 13.4004 2.46184 13.4004C3.09067 13.4004 3.72527 13.2413 4.25314 13.0453C4.51852 12.9458 4.76659 12.835 4.98293 12.7214C5.86848 13.1532 6.89826 13.4004 8.00016 13.4004Z" fill="#848484" />
                                                </svg>
                                                {item.comment}
                                            </div>
                                            <div className={styles.interactions}> <div />
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.33398 14V3.33333C3.33398 2.96667 3.46465 2.65267 3.72598 2.39133C3.98732 2.13 4.3011 1.99956 4.66732 2H11.334C11.7007 2 12.0147 2.13067 12.276 2.392C12.5373 2.65333 12.6678 2.96711 12.6673 3.33333V14L8.00065 12L3.33398 14Z" fill="#848484" />
                                                </svg>
                                                {item.favoriteAdd}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </AutoPlaySwipeableViews>
                        <MobileStepper
                            steps={maxSteps}
                            sx={{ backgroundColor: 'transparent', color: "black" }}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
                                <Button
                                    sx={{ color: "black" }}
                                    size="small"
                                    onClick={handleNext}
                                    disabled={activeStep === maxSteps - 1}
                                >

                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft />
                                    ) : (
                                        <KeyboardArrowRight />
                                    )}
                                </Button>
                            }
                            backButton={
                                <Button
                                    sx={{ color: "black" }}
                                    size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight />
                                    ) : (
                                        <KeyboardArrowLeft />
                                    )}

                                </Button>
                            }
                        />
                    </Box>
                    :
                    <CircularProgress />
                }
                {
                    IncidentsNewsArr.length <= 0 &&
                    <h1>Новости скоро будут</h1>
                }
            </div>

        </>
    )
}