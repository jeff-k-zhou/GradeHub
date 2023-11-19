import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
import calculateGPA from './functions/calculateGPA'
import fetchGrades from './functions/fetchGrades'
import client from './axios'
import { Card, CardBody, Spinner } from '@nextui-org/react'

export default function Chart() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
    )

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'GPA Over Time',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 6,
                ticks: {
                    stepSize: 0.5,
                },
            },
        },
    }

    const labels = ["MP1", "MP2", "MP3", "MP4"]
    const [data, setData] = useState<any>(null)
    const [count, setCount] = useState(0)
    useEffect(() => {
        let dataset: number[] = [0, 0, 0, 0]
        for (let i = 0; i < 4; i++) {
            if (window.sessionStorage.getItem((i + 1).toString())) {
                const grades = JSON.parse(window.sessionStorage.getItem((i + 1).toString())!)
                const weighted = calculateGPA(grades, i + 1)
                if (weighted !== -1) {
                    dataset[i] = Number(weighted.gpa)
                } else {
                    dataset[i] = 0
                }
                setData({
                    labels: labels,
                    datasets: [
                        {
                            data: labels.map((_item, index) => dataset[index]),
                            backgroundColor: '#006FEE',
                            borderColor: '#006FEE',
                        },
                    ],
                })
                setCount(count => count + 1)
                console.log(count)
            } else {
                client.post("/decrypt", {
                    username: localStorage.getItem("username"),
                    password: localStorage.getItem("password")
                }).then((decryptedInfo) => {
                    fetchGrades(decryptedInfo.data.username, decryptedInfo.data.password, (i + 1)).then((grades) => {
                        if (grades.error) {
                            console.log(grades.data)
                            dataset[i] = 0
                        } else {
                            const weighted = calculateGPA(grades.data.grades, Number(grades.data.mp))
                            if (weighted !== -1) {
                                dataset[i] = Number(weighted.gpa)
                            } else {
                                dataset[i] = 0
                            }
                            window.sessionStorage.setItem(grades.data.mp, JSON.stringify(grades.data.grades))
                        }
                        setData({
                            labels: labels,
                            datasets: [
                                {
                                    data: labels.map((_item, index) => dataset[index]),
                                    backgroundColor: '#006FEE',
                                    borderColor: '#006FEE',
                                },
                            ],
                        })
                        setCount(count => count + 1)
                        console.log(count)
                    })
                })
            }
        }
    }, [])
    return (
        <Card className="w-full lg:w-2/3">
            <CardBody className="w-full h-full flex flex-col items-center justify-center">
                {
                    !data || count < 4 ? <>
                        <Spinner />
                        <p className="mt-5">Crunching the latest data...</p>
                    </> :
                        <Line data={data} options={options} />
                }
            </CardBody>
        </Card>
    )
}

