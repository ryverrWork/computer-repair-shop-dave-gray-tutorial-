import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import TicketForm from "@/app/(rs)/tickets/form/TicketForm";

export default async function TicketFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId, ticketId } = await searchParams;

  let customer = null;
  let ticket = null;
  let errorMessage: string | null = null;

  try {
    if (!customerId && !ticketId) {
      errorMessage = "Ticket ID or Customer ID required to load ticket form";
    }

    // New ticket form
    if (customerId) {
      customer = await getCustomer(parseInt(customerId));

      if (!customer) {
        errorMessage = `Customer ID #${customerId} not found`;
      } else if (!customer.active) {
        errorMessage = `Customer ID #${customerId} is not active`;
      }

      console.log(customer);
      // return ticket form
      return <TicketForm customer={customer} />
    }

    if (ticketId) {
      ticket = await getTicket(parseInt(ticketId));

      if (!ticket) {
        errorMessage = `Ticket ID #${ticketId} not found`;
      } else {
        customer = await getCustomer(ticket.customerId);
      }

      console.log("ticket: ", ticket);
      console.log("customer: ", customer);
      // return ticket form
      return <TicketForm customer={customer} ticket={ticket} />
    }
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }

  if (errorMessage) {
    return (
      <>
        <h2 className="text-2xl mb-2">{errorMessage}</h2>
        <BackButton title="Go Back" variant="default" />
      </>
    );
  }
}
