/**
 * Module for creating an email subject line for grocery specials.
 *
 * @module emailSubject
 * @exports emailSubject
 * @author Carl Gross
 */

/**
 * Creates an email subject line for grocery specials.
 *
 * @param {string} dateFrom - The date range for the email subject.
 * @param {string} dateTo - The date range for the email subject.
 * @returns {string} - The email subject line.
 */
export const emailSubject = (dateFrom, dateTo) => {
  return `Grocery Specials For ${dateFrom} - ${dateTo}`;
};
