import { reportImages } from ".";
import insertReportVariables from "../utils/insertReportVariables";
import { saveAs } from 'file-saver'
import { ISave, Project } from "src/types/preference";
import { reportInfo } from "..";
import { State } from "src/pages/home";
import { ResultsState } from "src/slices/results";

function createPDF(html: string, title: string, images: reportImages[], project: Project, state: State, results: ResultsState, reportData: reportInfo) {
    alert("This feature is still under development.");
}

export default createPDF;