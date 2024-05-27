import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
} from "chart.js"
import { Line } from 'react-chartjs-2'
import Loading from "../Loading"

interface Props {
    gpa1: number
    gpa2: number
}

export default function GPAChart(props: Props) {
    Chart.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Filler
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

    const labels = ["Current", "Predicted"]
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'GPA',
                data: labels.map((_item, index) => ([props.gpa1, props.gpa2])[index]),
                fill: true,
                borderColor: (props.gpa2- props.gpa1 > 0) ? 'rgb(0,111,238)' : 'rgb(243,18,96)',
                backgroundColor: (props.gpa2- props.gpa1 > 0) ? 'rgb(0,111,238,0.4)' : 'rgb(243,18,96,0.4)'
            }
        ]
    }

    if (!data) {
        return <Loading />
    } else {
        return (
            <>
                <Line data={data} options={options} />
            </>
        )
    }
}