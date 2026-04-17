import { NextRequest, NextResponse } from "next/server";

const HS_TOKEN = process.env.HUBSPOT_TOKEN!;
const PIPELINE_ID = "default";
const STAGE_ID = "appointmentscheduled"; // "Leads"

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, teamSize, regime, annualSavings, inefficiencyCost } = body;

  try {
    // 1. Criar ou atualizar contato
    const contactRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HS_TOKEN}`,
      },
      body: JSON.stringify({
        properties: {
          firstname: name,
          email,
          phone,
        },
      }),
    });

    let contactId: string | null = null;

    if (contactRes.ok) {
      const contact = await contactRes.json();
      contactId = contact.id;
    } else if (contactRes.status === 409) {
      // Contato já existe — busca pelo email
      const searchRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${HS_TOKEN}`,
          },
          body: JSON.stringify({
            filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
          }),
        }
      );
      const searchData = await searchRes.json();
      contactId = searchData.results?.[0]?.id ?? null;
    }

    // 2. Criar negócio no funil
    const dealName = `${name} - ${teamSize} vendedores (Calculadora ROI)`;
    const dealRes = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HS_TOKEN}`,
      },
      body: JSON.stringify({
        properties: {
          dealname: dealName,
          pipeline: PIPELINE_ID,
          dealstage: STAGE_ID,
          description: `Regime: ${regime.toUpperCase()} | Time: ${teamSize} vendedores | Economia anual estimada: R$ ${Math.round(annualSavings)} | Ineficiência/mês: R$ ${Math.round(inefficiencyCost)}`,
        },
      }),
    });

    const deal = await dealRes.json();

    // 3. Associar contato ao negócio
    if (contactId && deal.id) {
      await fetch(
        `https://api.hubapi.com/crm/v3/objects/deals/${deal.id}/associations/contacts/${contactId}/deal_to_contact`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${HS_TOKEN}` },
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("HubSpot error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
