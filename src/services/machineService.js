import Machine from '../models/machineModel.js'
import Report from '../models/reportModel.js'
import AppError from '../utils/appError.js'

export const createMachine = async (data) => {
    const {
        reference,
        name,
        workshop,
        state
    } = data
    if (!reference || !name || !workshop) {
        throw new AppError('Reference, name, and workshop are required', 400)
    }

    if (state && !['disponible', 'en maintenance', 'hors service'].includes(state)) {
        throw new AppError('Unknown state', 400)
    }

    const existing = await Machine.findOne({
        reference
    })

    if (existing) {
        throw new AppError('Machine already exists', 409)
    }

    const machine = await Machine.create(data)

    return machine
}


export const getMachines = async (filters) => {
    const query = {}
    if (filters.workshop) {
        query.workshop = filters.workshop
    }
    if (filters.state) {
        if (!['disponible', 'en maintenance', 'hors service'].includes(filters.state)) {
            throw new AppError('Unknown state', 400)
        }
        query.state = filters.state
    }
    const machines = await Machine.find(query)
    return machines
}

export const getMachine = async (id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new AppError('Malformed ID', 400)
    }
    const machine = await Machine.findById(id)
    if (!machine) {
        throw new AppError('machine not found', 404)
    }
    return machine
}

export const updateMachine = async (id, data) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new AppError('Malformed ID', 400)
    }

    if (data.state && !['disponible', 'en maintenance', 'hors service'].includes(data.state)) {
        throw new AppError('Unknown state', 400)
    }

    if (data.reference) {
        const existing = await Machine.findOne({
            reference: data.reference,
            _id: {
                $ne: id
            }
        })
        if (existing) {
            throw new AppError('Reference already used', 409)
        }
    }

    const machine = await Machine.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    })
    if (!machine) {
        throw new AppError('Machine not found', 404)
    }
    return machine
}

export const deleteMachine = async (id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new AppError('Malformed ID', 400)
    }

    const machine = await Machine.findById(id)
    if (!machine) {
        throw new AppError('Machine not found', 404)
    }

    const reportsCount = await Report.countDocuments({
        machine: id
    })
    if (reportsCount > 0) {
        throw new AppError('Machine has reports and cannot be deleted', 409)
    }

    await Machine.findByIdAndDelete(id)
}

export const getMachineReports = async (id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new AppError('Malformed ID', 400)
    }
    const machine = await Machine.findById(id)
    if (!machine) {
        throw new AppError('Machine not found', 404)
    }
    const reports = await Report.find({
        machine: id
    }).populate('reportedBy', 'name email').populate('machine', 'reference name')
    return reports
}