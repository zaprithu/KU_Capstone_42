# Use AWS Lambda Python 3.9 runtime as base image
FROM public.ecr.aws/lambda/python:3.9

# Install necessary system dependencies
# RUN yum install -y gcc gcc-c++ make pkg-config alsa-lib-devel ffmpeg
RUN yum -y update \
    && yum install -y gcc gcc-c++ make pkg-config alsa-lib-devel tar xz \
    && yum clean all

RUN curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-i686-static.tar.xz -o /tmp/ffmpeg.tar.xz \
    && tar -xJf /tmp/ffmpeg.tar.xz -C /tmp \
    && cp /tmp/ffmpeg-*/ffmpeg /usr/local/bin/ \
    && rm -rf /tmp/ffmpeg-*



# Install Rust and Cargo for compiling dependencies
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"

# Copy requirements and Lambda function code
COPY requirements.txt .


# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt -t ${LAMBDA_TASK_ROOT}

COPY lambda_function.py ${LAMBDA_TASK_ROOT}
COPY output.wav ${LAMBDA_TASK_ROOT}

CMD ["lambda_function.lambda_handler"]
