# GSC+ Single Wallet Integration

This project has been converted from the previous GameXA flow to a GSC+ v2.0.6 Single Wallet flow.

## What changed

- GameXA API routes and client were removed.
- Local `User.playerId` is now the local player identifier.
- GSC+ is the gaming provider.
- The existing BDT wallet is the source of truth.
- GSC+ callbacks mutate the wallet inside Prisma database transactions.
- Provider transaction IDs are unique to prevent duplicate wallet movements.
- Push Bet Data is stored separately as `GscWager` and does not change wallet balance.
- Game launch uses `POST /api/operators/launch-game`.

## Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL`
- `SHADOW_DATABASE_URL`
- `AUTH_SECRET`
- `GSC_OPERATOR_CODE`
- `GSC_SECRET_KEY`
- `GSC_BASE_URL`
- `GSC_CURRENCY`
- `GSC_LOBBY_URL`
- `GSC_CALLBACK_BASE_URL`

Do not commit the real GSC secret key.

## Database

Run:

```bash
npx prisma migrate deploy
npx prisma generate
```

The included migration removes the legacy `User.gameXAPlayerId` column and creates:

- `GscWalletTransaction`
- `GscWager`

## GSC+ callback URLs

Configure these callback URLs in the GSC+ staging/backoffice configuration:

```text
POST https://YOUR_DOMAIN/api/gsc/callback/seamless/balance
POST https://YOUR_DOMAIN/api/gsc/callback/seamless/withdraw
POST https://YOUR_DOMAIN/api/gsc/callback/seamless/deposit
POST https://YOUR_DOMAIN/api/gsc/callback/seamless/pushbetdata
```

The exact public domain must be HTTPS and reachable by GSC+.

## Game APIs

```text
GET  /api/gsc/products
GET  /api/gsc/games?product_code=1007&game_type=SLOT
POST /api/gsc/launch
```

Launch body example:

```json
{
  "gameCode": "vs20sugarrush",
  "productCode": 1007,
  "gameType": "SLOT",
  "platform": "WEB"
}
```

The project also exposes compatibility routes:

```text
GET  /api/games
POST /api/games/list
GET  /api/games/providers
GET  /api/games/provider/:providerCode
POST /api/open-game
```

## Signature rules implemented

Operator-side API signatures follow the GSC+ document:

```text
MD5(request_time + secret_key + action + operator_code)
```

For seamless callbacks:

```text
MD5(operator_code + request_time + action + secret_key)
```

Push Bet Data uses:

```text
MD5(operator_code + request_time + pushbetdata + secret_key)
```

## Important staging checks

Before enabling real play, verify in GSC+ staging/backoffice:

1. The contracted player currency. The sample configuration uses `BDT`, but the provider must confirm that `BDT` is enabled for `IGB1`.
2. The callback base URL and all four seamless callback paths.
3. The launch-game member password behavior. The current default uses the member phone as the launch password. If GSC+ requires another member password convention, change `GSC_LAUNCH_PASSWORD_MODE` and the launch implementation accordingly.
4. The product codes returned by `/api/operators/available-products`.
5. A staging test member with a small balance.

## Security

The supplied GSC secret was not embedded in this ZIP. Put it in your private `.env`/deployment secret store. Because a real secret was previously shared in chat, rotate it before production if possible.
