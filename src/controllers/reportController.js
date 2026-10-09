import * as reportService from '../services/reportService.js'

export const createReport = async (req, res) => {

    const report = await reportService.createReport(req.user._id, req.body)
    
    res.status(201).json(report)
}

export const getReports = async (req, res) => {

    const reports = await reportService.getReports(req.query)

    res.status(200).json(reports)
}

export const getReport = async (req, res) => {

    const report = await reportService.getReport(req.params.id)

    res.status(200).json(report)
}

export const updateReport = async (req, res) => {

    const report = await reportService.updateReport(req.params.id, req.body)

    res.status(200).json(report)
}