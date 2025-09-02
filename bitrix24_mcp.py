import os
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("bitrix24-mcp")


async def _resolver_scouter_id(scouter: str, token: str, portal: str) -> str:
    """Resolve o identificador do scouter a partir do nome ou ID."""
    if scouter.isdigit():
        return scouter

    url = f"https://{portal}/rest/user.get.json"
    params = {"filter[NAME]": scouter}
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url, params=params, headers=headers)
        resp.raise_for_status()
        users = resp.json().get("result", [])

    if not users:
        raise ValueError("Scouter não encontrado")

    return str(users[0]["ID"])


@mcp.tool()
async def bitrix24_contar_leads(inicio: str, fim: str, scouter: str) -> dict:
    """Conta leads no Bitrix24 por período e scouter."""
    token = os.environ["BITRIX24_TOKEN"]
    portal = os.environ["BITRIX24_HOST"]
    scouter_id = await _resolver_scouter_id(scouter, token, portal)

    url = f"https://{portal}/rest/crm.lead.list.json"
    data = {
        "filter[>=DATE_CREATE]": inicio,
        "filter[<=DATE_CREATE]": fim,
        "filter[ASSIGNED_BY_ID]": scouter_id,
    }
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(url, data=data, headers=headers)
        resp.raise_for_status()
        leads = resp.json().get("result", [])
    return {"sucesso": True, "total": len(leads)}


if __name__ == "__main__":
    mcp.run()
