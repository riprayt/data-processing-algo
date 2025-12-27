from src.lemonade import bad_greedy_small_first, good_greedy


def _format_register(register):
    order = [5, 10, 20, 50]
    return "{" + ", ".join(f"{d}:{register.get(d, 0)}" for d in order) + "}"


def _print_trace(trace):
    headers = ["step", "pay", "change", "bills_given", "before", "after"]
    print(" | ".join(h.ljust(12) for h in headers))
    print("-" * 80)
    for idx, step in enumerate(trace):
        bills = "-" if step["bills_given"] is None else ",".join(str(b) for b in step["bills_given"])
        row = [
            str(idx).ljust(12),
            str(step["payment"]).ljust(12),
            str(step["change_due"]).ljust(12),
            bills.ljust(12),
            _format_register(step["register_before"]).ljust(12),
            _format_register(step["register_after"]).ljust(12),
        ]
        print(" | ".join(row))
    print()


def _run_demo(payments):
    print(f"Payments: {payments}")
    for name, func in [("GOOD", good_greedy), ("BAD_SMALL_FIRST", bad_greedy_small_first)]:
        ok, fail_idx, trace = func(payments)
        status = "PASS" if ok else f"FAIL at customer {fail_idx}"
        print(f"Strategy {name}: {status}")
        _print_trace(trace)
    print("=" * 80)


def main():
    demos = [
        [5, 5, 5, 10, 20, 10],
        [10],
        [5, 5, 5, 10, 5, 10, 20, 5, 10, 50],
    ]
    for payments in demos:
        _run_demo(payments)


if __name__ == "__main__":
    main()
