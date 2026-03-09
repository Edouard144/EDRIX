import * as billingService from './billing.service.js';
import { sendSuccess } from '../../utils/response.js';

export const getPlans = async (req, res, next) => {
  try {
    const plans = await billingService.getPlans();
    sendSuccess(res, { plans });
  } catch (err) { next(err); }
};

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await billingService.getSubscription(req.params.orgId);
    sendSuccess(res, { subscription });
  } catch (err) { next(err); }
};

export const changePlan = async (req, res, next) => {
  try {
    const subscription = await billingService.changePlan(req.params.orgId, req.body.plan);
    sendSuccess(res, { subscription }, 'Plan updated');
  } catch (err) { next(err); }
};

export const getUsageSummary = async (req, res, next) => {
  try {
    const usage = await billingService.getUsageSummary(req.params.orgId);
    sendSuccess(res, { usage });
  } catch (err) { next(err); }
};

export const generateInvoice = async (req, res, next) => {
  try {
    const invoice = await billingService.generateInvoice(req.params.orgId);
    sendSuccess(res, { invoice }, 'Invoice generated', 201);
  } catch (err) { next(err); }
};

export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await billingService.getInvoices(req.params.orgId);
    sendSuccess(res, { invoices });
  } catch (err) { next(err); }
};

export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await billingService.getInvoice(req.params.invoiceId);
    sendSuccess(res, { invoice });
  } catch (err) { next(err); }
};