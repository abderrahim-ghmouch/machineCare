import Report from '../models/reportModel.js'
import Machine from '../models/machineModel.js'
import AppError from '../utils/appError.js'

export const createReport = async (userId, data) => {
    const {
        machine,
        description
    } = data

    if (!machine || !machine.match(/^[0-9a-fA-F]{24}$/)) {
        throw new AppError('Malformed or missing machine ID', 400)
    }
    if (!description || description.trim() === '') {
        throw new AppError('Description is required', 400)
    }

    const machineExists = await Machine.findById(machine)
    if (!machineExists) {
        throw new AppError('Machine not found', 404)
    }

    const report = await Report.create({
        machine,
        description: description.trim(),
        reportedBy: userId,
        status: 'ouvert'
    })

    return await Report.findById(report._id).populate('reportedBy', 'name email').populate('machine', 'reference name')
}

export const getReports = async (filters) => {
    const query = {}
    if (filters.machine) {
        if (!filters.machine.match(/^[0-9a-fA-F]{24}$/)) {
            throw new AppError('Malformed machine ID', 400)
        }
        query.machine = filters.machine
    }
    if (filters.status) {
        if (!['ouvert', 'en cours', 'résolu'].includes(filters.status)) {
            throw new AppError('Unknown status', 400)
        }
        query.status = filters.status
    }

    const reports = await Report.find(query).populate('reportedBy', 'name email').populate('machine', 'reference name')
    return reports
}

export const getReport = async (id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new AppError('Malformed ID', 400)
    }
    const report = await Report.findById(id).populate('reportedBy', 'name email').populate('machine', 'reference name')
    if (!report) {
        throw new AppError('Report not found', 404)
    }
    return report
}

export const updateReport = async (id, data) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new AppError('Malformed ID', 400)
    }

    const report = await Report.findById(id)
    if (!report) {
        throw new AppError('Report not found', 404)
    }

    if (data.description) {
        if (data.description.trim() === '') {
            throw new AppError('Description cannot be empty', 400)
        }
        report.description = data.description.trim()
    }

    if (data.status) {
        if (!['ouvert', 'en cours', 'résolu'].includes(data.status)) {
            throw new AppError('Unknown status', 400)
        }

        // Transitions: ouvert -> en cours, ouvert -> résolu, en cours -> résolu.
        // Once résolu, no changing status except to résolu.
        const current = report.status
        const next = data.status

        if (current === 'résolu' && next !== 'résolu') {
            throw new AppError('Cannot change status of a resolved report', 400)
        }
        if (current === 'en cours' && next === 'ouvert') {
            throw new AppError('Cannot transition from en cours to ouvert', 400)
        }

        if (next === 'résolu' && current !== 'résolu') {
            if (!data.resolutionNote || data.resolutionNote.trim() === '') {
                throw new AppError('Resolution note is required to resolve a report', 400)
            }
            report.resolutionNote = data.resolutionNote.trim()
            report.resolvedAt = new Date()
        }

        report.status = next
    }

    if (data.resolutionNote !== undefined && data.status !== 'résolu' && report.status !== 'résolu') {
        report.resolutionNote = data.resolutionNote
    }

    await report.save()
    return await Report.findById(report._id).populate('reportedBy', 'name email').populate('machine', 'reference name')
}