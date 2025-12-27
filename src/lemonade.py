PRICE = 5
ALLOWED_BILLS = {5, 10, 20, 50}


def _snapshot(register):
    return {denom: register.get(denom, 0) for denom in sorted(ALLOWED_BILLS)}


def _apply_payment(register, payment, bills_given):
    updated = _snapshot(register)
    for bill in bills_given:
        updated[bill] -= 1
        if updated[bill] < 0:
            raise ValueError("Attempted to give unavailable bill")
    updated[payment] += 1
    return updated


def _good_change(change_due, register):
    if change_due == 0:
        return []
    if change_due == 5:
        return [5] if register.get(5, 0) >= 1 else None
    if change_due == 15:
        if register.get(10, 0) >= 1 and register.get(5, 0) >= 1:
            return [10, 5]
        if register.get(5, 0) >= 3:
            return [5, 5, 5]
        return None
    if change_due == 45:
        combos = [
            [20, 20, 5],
            [20, 10, 10, 5],
            [10, 10, 10, 10, 5],
        ]
        for combo in combos:
            counts = _snapshot(register)
            possible = True
            for bill in combo:
                counts[bill] -= 1
                if counts[bill] < 0:
                    possible = False
                    break
            if possible:
                return combo
        return None
    return None


def _bad_change(change_due, register):
    if change_due == 0:
        return []
    remaining = change_due
    bills = []
    working = _snapshot(register)
    for bill in sorted(ALLOWED_BILLS):
        while remaining >= bill and working.get(bill, 0) > 0:
            remaining -= bill
            bills.append(bill)
            working[bill] -= 1
        if remaining == 0:
            break
    return bills if remaining == 0 else None


def _run(payments, chooser):
    register = {bill: 0 for bill in ALLOWED_BILLS}
    trace = []
    for idx, payment in enumerate(payments):
        if payment not in ALLOWED_BILLS:
            raise ValueError(f"Invalid bill: {payment}")
        change_due = payment - PRICE
        before = _snapshot(register)
        bills_given = chooser(change_due, register)
        if bills_given is None:
            trace.append(
                {
                    "payment": payment,
                    "change_due": change_due,
                    "bills_given": None,
                    "register_before": before,
                    "register_after": before,
                }
            )
            return False, idx, trace
        register = _apply_payment(register, payment, bills_given)
        trace.append(
            {
                "payment": payment,
                "change_due": change_due,
                "bills_given": bills_given,
                "register_before": before,
                "register_after": _snapshot(register),
            }
        )
    return True, None, trace


def good_greedy(payments):
    return _run(payments, _good_change)


def bad_greedy_small_first(payments):
    return _run(payments, _bad_change)
