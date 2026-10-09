import * as machineService from '../services/machineService.js'

export const createMachine = async (req, res) => {
    const machine = await machineService.createMachine(req.body)
    res.status(201).json(machine)
}

export const getMachines = async (req, res) => {
    const machines = await machineService.getMachines(req.query)
    res.status(200).json(machines)
}

export const getMachine = async (req, res) => {
    const machine = await machineService.getMachine(req.params.id)
    res.status(200).json(machine)
}

export const updateMachine = async (req, res) => {
    const machine = await machineService.updateMachine(req.params.id, req.body)
    res.status(200).json(machine)
}

export const deleteMachine = async (req, res) => {
    await machineService.deleteMachine(req.params.id)
    res.status(204).send()
}

export const getMachineReports = async (req, res) => {
    const reports = await machineService.getMachineReports(req.params.id)
    res.status(200).json(reports)
}