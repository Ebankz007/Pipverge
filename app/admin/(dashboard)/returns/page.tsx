import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { AdminHeader, tableClass, tdClass, thClass } from "@/components/admin/admin-header";
import { ActionForm } from "@/components/admin/action-form";
import { Input, Label, Select } from "@/components/ui/field";
import { DangerButton } from "@/components/admin/danger-button";
import { deleteReturnAction, saveReturnAction } from "@/app/admin/actions/catalog";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default async function AdminReturnsPage() {
  await requireAdmin();
  const returns = await prisma.monthlyReturn.findMany({
    orderBy: [{ year: "desc" }, { month: "asc" }],
  });

  const year = new Date().getFullYear();

  return (
    <>
      <AdminHeader
        title="Monthly returns"
        description="Illustrative monthly performance used by the homepage chart. Sample data — label it as such."
      />

      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-foreground">
          Add / update month
        </h2>
        <ActionForm action={saveReturnAction} submitLabel="Save month">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label>Year</Label>
              <Input name="year" type="number" defaultValue={year} required />
            </div>
            <div>
              <Label>Month</Label>
              <Select name="month" defaultValue="1">
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Return (%)</Label>
              <Input name="pct" type="number" step="0.1" placeholder="5.2" required />
            </div>
          </div>
        </ActionForm>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Year</th>
              <th className={thClass}>Month</th>
              <th className={thClass}>Return</th>
              <th className={thClass} />
            </tr>
          </thead>
          <tbody>
            {returns.map((r) => (
              <tr key={r.id}>
                <td className={tdClass}>{r.year}</td>
                <td className={tdClass}>{MONTHS[r.month - 1]}</td>
                <td className={tdClass}>
                  <span className={r.pct >= 0 ? "text-success" : "text-danger"}>
                    {r.pct >= 0 ? "+" : ""}
                    {r.pct.toFixed(1)}%
                  </span>
                </td>
                <td className={tdClass}>
                  <form action={deleteReturnAction} className="flex justify-end">
                    <input type="hidden" name="id" value={r.id} />
                    <DangerButton message={`Delete ${MONTHS[r.month - 1]} ${r.year}?`} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
