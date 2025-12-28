def make_change_greedy(change_due, register):
    # keep track of bills we use
    bills_used = []
    
    # try each bill size from biggest to smallest
    for bill_type in [50, 20, 10, 5]:
        while change_due >= bill_type and register[bill_type] > 0:
            bills_used.append(bill_type)
            change_due -= bill_type
            register[bill_type] -= 1
    
    # check if we made exact change
    if change_due == 0:
        return bills_used
    else:
        # oops, put the bills back since we failed
        for bill in bills_used:
            register[bill] += 1
        return None


def process_payments(payments):
    # set up the register with no money at start
    register = {5: 0, 10: 0, 20: 0, 50: 0, 100: 0}
    
    lemonade_price = 5
    
    # go through each customer
    for i, payment in enumerate(payments):
        change_due = payment - lemonade_price
        
        # try to give them change
        bills_given = make_change_greedy(change_due, register)
        
        if bills_given is None:
            # we couldn't make change, so stop
            return (False, i + 1, payment)
        
        # we gave them change, now put their payment in the register
        register[payment] += 1
    
    # everyone got served
    return (True, None, None)


# test with demo cases
if __name__ == "__main__":
    # demo a should work
    demo_a = [5, 5, 5, 10, 20, 10]
    result_a = process_payments(demo_a)
    print(f"demo a {demo_a}: {result_a}")
    
    # demo b should fail at customer 1
    demo_b = [10]
    result_b = process_payments(demo_b)
    print(f"demo b {demo_b}: {result_b}")
    
    # demo c should work
    demo_c = [5, 5, 5, 10, 5, 10, 20, 5, 10, 50]
    result_c = process_payments(demo_c)
    print(f"demo c {demo_c}: {result_c}")
