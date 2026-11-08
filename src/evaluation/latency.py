import time


def measure_execution_time(
    func,
    *args,
    **kwargs
):
    """
    Measure execution time of a function.
    """

    start_time = time.perf_counter()

    result = func(
        *args,
        **kwargs
    )

    end_time = time.perf_counter()

    execution_time = round(
        end_time - start_time,
        4
    )

    return result, execution_time